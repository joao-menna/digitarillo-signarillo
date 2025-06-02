default_location=$(pwd)

cd ./../

# Define paths
root_path=$(pwd)
packages_path="$root_path/packages"
backend_path="$packages_path/backend"
frontend_path="$packages_path/frontend"

# Install bun
npm i -g bun

# Go to backend package
cd $backend_path

bun install

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Go to frontend package
cd $frontend_path

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Install deps and build
bun install
bun run build

# Run Docker Compose
cd $root_path
sudo docker compose up --build -d

# Run migrations
cd $backend_path
bun migration:migrate

# Return to default folder
cd $default_location
