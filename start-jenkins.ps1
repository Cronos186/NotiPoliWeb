# start-jenkins.ps1
# Script de inicio para el contenedor de Jenkins (Integración Continua)
# Requisitos previos:
#   1. Docker Desktop corriendo
#   2. Puerto 8080 y 50000 libres (el frontend de NotiPoliWeb usa ahora el puerto 3001)

$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidor de Integración Continua: Jenkins" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que Docker está corriendo
Write-Host "Verificando estado de Docker..." -ForegroundColor Gray
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no está respondiendo."
    }
    Write-Host "[OK] Docker está activo y respondiendo." -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Desktop no está corriendo. Ábrelo manualmente y vuelve a intentarlo." -ForegroundColor Red
    exit 1
}

# 2. Verificar si ya hay un contenedor de Jenkins en ejecución
$existingContainer = docker ps -a --filter "name=jenkins-notipoli" --format "{{.Names}}" 2>$null
if ($existingContainer -eq "jenkins-notipoli") {
    $status = docker inspect -f "{{.State.Status}}" jenkins-notipoli 2>$null
    if ($status -eq "running") {
        Write-Host "[INFO] El contenedor de Jenkins ya está en ejecución." -ForegroundColor Yellow
        Write-Host "Accede a Jenkins en: http://localhost:8080" -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "[INFO] Deteniendo contenedor previo de Jenkins..." -ForegroundColor Yellow
        docker stop jenkins-notipoli | Out-Null
        docker rm jenkins-notipoli | Out-Null
    }
}

# 3. Iniciar el contenedor de Jenkins
Write-Host "Iniciando contenedor Jenkins (puede tomar 15-20 segundos la primera vez)..." -ForegroundColor Gray
docker run -d `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  --name jenkins-notipoli `
  jenkins/jenkins:lts

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo iniciar el contenedor de Jenkins." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Contenedor de Jenkins iniciado correctamente." -ForegroundColor Green
Write-Host ""

# 4. Esperar a que Jenkins esté listo (aprox. 45 segundos)
Write-Host "Esperando a que Jenkins esté listo para atender peticiones..." -ForegroundColor Gray
$attempts = 0
$ready = $false
while ($attempts -lt 15) {
    Start-Sleep -Seconds 5
    $attempts++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/login" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
        # Aún no está listo, continuamos esperando
    }
    Write-Host "." -NoNewline -ForegroundColor DarkGray
}

Write-Host ""
if ($ready) {
    Write-Host "[OK] Jenkins está respondiendo en: http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "[ADVERTENCIA] Jenkins está inicializando. Espere 30 segundos más y recargue la página." -ForegroundColor Yellow
}

# 5. Mostrar la contraseña de administrador inicial
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  CONTRASEÑA DE ADMINISTRADOR INICIAL" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copia esta contraseña para desbloquear Jenkins en tu primera visita:" -ForegroundColor Yellow
Write-Host ""
docker exec jenkins-notipoli cat /var/jenkins_home/secrets/initialAdminPassword 2>$null
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Acceso directo" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Jenkins:        http://localhost:8080" -ForegroundColor White
Write-Host "  Frontend:       http://localhost:3001" -ForegroundColor White
Write-Host "  Backend API:    http://localhost:3000" -ForegroundColor White
Write-Host ""