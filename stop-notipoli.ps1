# Stop-Notipoli.ps1
# Detiene notipoli-front, notipoli-back y notipoli-db en orden inverso
# Pregunta interactivamente si desea ejecutar docker system prune sin volúmenes

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host '=== Deteniendo notipoli-front ===' -ForegroundColor Cyan
Push-Location "$root\front-react"
docker compose down
Pop-Location

Write-Host '=== Deteniendo notipoli-back ===' -ForegroundColor Cyan
Push-Location "$root\back-nest"
docker compose down
Pop-Location

Write-Host '=== Deteniendo notipoli-db ===' -ForegroundColor Cyan
Push-Location "$root\bd-posgress"
docker compose down
Pop-Location

$answer = Read-Host 'Desea ejecutar docker system prune para liberar espacio? (S/N)'
if ($answer -match '^[SsYy]$') {
  Write-Host '=== Ejecutando docker system prune sin volumenes ===' -ForegroundColor Yellow
  Write-Host 'Los volumenes de Postgres se conservan' -ForegroundColor Gray
  docker system prune -f
  Write-Host 'Prune completado' -ForegroundColor Green
} else {
  Write-Host 'Prune omitido.' -ForegroundColor Gray
}

Write-Host '=== Todos los servicios detenidos ===' -ForegroundColor Green
