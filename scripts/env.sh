#!/bin/bash
set -e

DEFAULT_NODE_ENV="NODE_ENV=development"
VITE_NODE_ENV="VITE_NODE_ENV=development"
LOGIN_DEFAULT="LOGIN_DEFAULT=False"

DEFAULT_DB_HOST="MYSQL_DB_HOST=localhost"
DEFAULT_DB_NAME="MYSQL_DB_NAME=activity_tracker"
DEFAULT_DB_USER="MYSQL_DB_USER="
DEFAULT_DB_PASSWORD="MYSQL_DB_PASSWORD="
DEFAULT_DB_LIMIT="MYSQL_DB_LIMIT=97"

DEFAULT_DISCORD_AT_DEVBOT="DISCORD_AT_DEVBOT="
SERVER_PORT="SERVER_PORT="
# crypto.randomBytes(64).toString('hex'); #  require('crypto').randomBytes(64).toString('hex'); 
JWT_SECRET="JWT_SECRET="

VITE_TARGET_API="VITE_TARGET_API="
VITE_PUBLIC_PATH="VITE_PUBLIC_PATH=activity-tracker"
VITE_MAX_USER_AGE="VITE_MAX_USER_AGE=3"

PM2_NAME="PM2_NAME=activity-tracker"
# Using FNM as nodemanager linux, /home/<user>/.local/share/fnm/node-versions/<version>/installation/bin/node
PM2_INTERPRETER="PM2_INTERPRETER="

MAX_IMAGE_COUNT="MAX_IMAGE_COUNT=5"
MAX_PDF_COUNT="MAX_PDF_COUNT=2"
MAX_VIDEO_COUNT="MAX_VIDEO_COUNT=1"

MAX_IMAGE_SIZE="MAX_IMAGE_SIZE=5"
MAX_PDF_SIZE="MAX_PDF_SIZE=3"
MAX_VIDEO_SIZE="MAX_VIDEO_SIZE=25"

DISCORD_USED="DISCORD_USED=development"

ELECTRON_URL="ELECTRON_URL='http://localhost:3500/'"

if [[ ! -f "./scripts/sample_env.txt" ]]; then
   touch ./scripts/sample_env.txt

   echo $DEFAULT_NODE_ENV >> ./scripts/sample_env.txt
   echo $VITE_NODE_ENV >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt
   echo $LOGIN_DEFAULT >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt
   echo $DEFAULT_DB_HOST >> ./scripts/sample_env.txt
   echo $DEFAULT_DB_NAME >> ./scripts/sample_env.txt
   echo $DEFAULT_DB_USER >> ./scripts/sample_env.txt
   echo $DEFAULT_DB_PASSWORD >> ./scripts/sample_env.txt
   echo $DEFAULT_DB_LIMIT >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt   
   echo $DEFAULT_DISCORD_AT_DEVBOT >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt   
   echo $SERVER_PORT >> ./scripts/sample_env.txt
   echo $JWT_SECRET >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt   
   echo $VITE_TARGET_API >> ./scripts/sample_env.txt
   echo $VITE_PUBLIC_PATH >> ./scripts/sample_env.txt
   echo $VITE_MAX_USER_AGE >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt
   echo $PM2_NAME >> ./scripts/sample_env.txt
   echo $PM2_INTERPRETER >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt   
   echo "" >> ./scripts/sample_env.txt   
   echo $MAX_IMAGE_COUNT >> ./scripts/sample_env.txt
   echo $MAX_PDF_COUNT >> ./scripts/sample_env.txt
   echo $MAX_VIDEO_COUNT >> ./scripts/sample_env.txt
   echo "" >> ./scripts/sample_env.txt   
   echo $MAX_IMAGE_SIZE >> ./scripts/sample_env.txt
   echo $MAX_PDF_SIZE >> ./scripts/sample_env.txt
   echo $MAX_VIDEO_SIZE >> ./scripts/sample_env.txt
   echo $DISCORD_USED >> ./scripts/sample_env.txt
   echo $ELECTRON_URL >> ./scripts/sample_env.txt
fi

if [[ ! -f "./scripts/z_env_config_production.txt" ]]; then
   echo "No "./scripts/z_env_config_production.txt" file found"
   echo "Creating new one"

   touch ./scripts/z_env_config_production.txt

   cp ./scripts/sample_env.txt ./scripts/z_env_config_production.txt
fi

if [[ ! -f "./scripts/z_env_config_staging.txt" ]]; then
   echo "No "./scripts/z_env_config_staging.txt" file found"
   echo "Creating new one"

   touch ./scripts/z_env_config_staging.txt

   cp ./scripts/sample_env.txt ./scripts/z_env_config_staging.txt
fi

if [[ "$1" == "--production" ]]; then
   cp ./scripts/z_env_config_production.txt .env

   cp .env ./server/.env
   cp .env ./uiv2/.env
   cp .env ./activity-tracker-app/.env
elif [[ "$1" == "--staging" ]]; then
   cp ./scripts/z_env_config_staging.txt .env

   cp .env ./server/.env
   cp .env ./uiv2/.env
   cp .env ./activity-tracker-app/.env
else
   echo "Usage --production | --staging"
fi
