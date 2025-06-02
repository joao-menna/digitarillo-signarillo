$scriptsPath=$(pwd)

cd ./../

# Run Docker Compose
docker compose up --watch

cd $scriptsPath
