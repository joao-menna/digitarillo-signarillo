$scriptsPath = Get-Location

Set-Location ./../

# Run Docker Compose
docker compose up --watch

Set-Location $scriptsPath
