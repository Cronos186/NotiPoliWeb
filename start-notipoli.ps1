# Start-Notipoli.ps1
# Levanta notipoli-db, notipoli-back y notipoli-front en orden, siembra datos y espera a que la API esté lista

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logFile = Join-Path $root 'seed.log'
$maxSizeBytes = 1MB

# Rotación simple de log
if (Test-Path $logFile) {
  $size = (Get-Item $logFile).Length
  if ($size -gt $maxSizeBytes) {
    $archived = "$logFile.old"
    Move-Item -Force $logFile $archived
    Write-Host "Log rotado a $archived" -ForegroundColor Yellow
  }
}

Write-Host '=== Levantando notipoli-db ===' -ForegroundColor Cyan
Push-Location "$root\bd-posgress"
docker compose up -d
Write-Host 'Esperando Postgres...' -ForegroundColor Yellow
Start-Sleep -Seconds 5
$retry = 0
do {
  try {
    docker exec notipoli-db pg_isready -U user -d graphify | Out-Null
    $ready = $true
  } catch { $ready = $false }
  if (-not $ready) {
    Start-Sleep -Seconds 3
    $retry++
  }
} while (-not $ready -and $retry -lt 20)
Pop-Location

Write-Host '=== Levantando notipoli-back ===' -ForegroundColor Cyan
Push-Location "$root\back-nest"
docker compose up -d --build

Write-Host 'Esperando API en http://localhost:3000/noticias ...' -ForegroundColor Yellow
$retry = 0
do {
  try {
    $resp = Invoke-WebRequest -Uri http://localhost:3000/noticias -UseBasicParsing -TimeoutSec 5
    $ready = $resp.StatusCode -eq 200
  } catch { $ready = $false }
  if (-not $ready) {
    Start-Sleep -Seconds 3
    $retry++
    Write-Host "Reintentando $retry..." -ForegroundColor Gray
    # Mostrar últimas líneas de logs sin lanzar errores
    $logs = docker compose logs --tail 50 2>&1
    if ($logs) { Write-Host $logs -ForegroundColor DarkGray }
  }
} while (-not $ready -and $retry -lt 30)

# Verificar que el contenedor realmente esté corriendo antes de sembrar
$containerRunning = $false
for ($i=0; $i -lt 10; $i++) {
  try {
    $state = docker inspect notipoli-back --format '{{.State.Running}}'
    if ($state -eq 'true') { $containerRunning = $true; break }
  } catch {}
  Start-Sleep -Seconds 3
}
if (-not $containerRunning) {
  Write-Host 'Contenedor notipoli-back no está corriendo. Mostrando logs...' -ForegroundColor Red
  docker compose logs --tail 200
  Write-Error 'Backend no disponible. Revisa los logs arriba.'
  Pop-Location
  exit 1
}

Write-Host 'Sembrando datos desde JSON...' -ForegroundColor Yellow
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$seedOutput = docker exec notipoli-back sh -c "npx ts-node src/seed.ts" 2>&1
$logEntry = "[$timestamp] Seed output:`n$seedOutput`n"
Add-Content -Path $logFile -Value $logEntry
Write-Host $seedOutput -ForegroundColor Green
if ($LASTEXITCODE -ne 0) {
  Write-Warning "La semilla terminó con código $LASTEXITCODE"
} else {
  Write-Host 'Semilla finalizada correctamente' -ForegroundColor Green
}
Pop-Location

Write-Host '=== Levantando notipoli-front ===' -ForegroundColor Cyan
Push-Location "$root\front-react"
docker compose up -d --build

# Logs del frontend
Write-Host 'Mostrando logs de Vite/React...' -ForegroundColor Yellow
Start-Sleep -Seconds 5
$frontLogs = docker compose logs --tail 100 2>&1
if ($frontLogs) { Write-Host $frontLogs -ForegroundColor DarkGray }

Pop-Location

Write-Host '=== Todo listo ===' -ForegroundColor Green
Write-Host 'Frontend: http://localhost:8080'
Write-Host 'API: http://localhost:3000/noticias'
Write-Host 'DB container: notipoli-db'
Write-Host "Log de semilla guardado en: $logFile"
