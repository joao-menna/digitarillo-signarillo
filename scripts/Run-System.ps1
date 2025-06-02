$defaultLocation = Get-Location

Set-Location ./../

# Define paths
$rootPath = Get-Location
$packagesPath = Join-Path $rootPath "packages"
$backendPath = Join-Path $packagesPath "backend"
$frontendPath = Join-Path $packagesPath "frontend"

# Install bun
npm i -g bun

# Go to backend package
Set-Location $backendPath

bun install

$envFilePath = Join-Path $backendPath ".env"
$envExampleFilePath = Join-Path $backendPath ".env.example"
if (!Test-Path $envFilePath -PathType Leaf) {
  Copy-Item $envExampleFilePath -Destination $envFilePath
}

# Go to frontend package
Set-Location $frontendPath

$envFilePath = Join-Path $frontendPath ".env"
$envExampleFilePath = Join-Path $frontendPath ".env.example"
if (!Test-Path $envFilePath -PathType Leaf) {
  Copy-Item $envExampleFilePath -Destination $envFilePath
}

# Install deps and build
bun install
bun run build

# Run Docker Compose
Set-Location $rootPath
docker compose up --build -d

# Run migrations
Set-Location $backendPath
bun migration:migrate

# Return to default folder
Set-Location $defaultLocation
