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
# Using FNM as nodemanager
PM2_INTERPRETER="PM2_INTERPRETER=/home/<user>/.local/share/fnm/node-versions/<version>/installation/bin/node"

MAX_IMAGE_COUNT="MAX_IMAGE_COUNT=5"
MAX_PDF_COUNT="MAX_PDF_COUNT=2"
MAX_VIDEO_COUNT="MAX_VIDEO_COUNT=1"

MAX_IMAGE_SIZE="MAX_IMAGE_SIZE=5"
MAX_PDF_SIZE="MAX_PDF_SIZE=3"
MAX_VIDEO_SIZE="MAX_VIDEO_SIZE=25"

DISCORD_USED="DISCORD_USED=development"

ELECTRON_URL="ELECTRON_URL='http://localhost:3500/'"

if [[ ! -f "z_env_config.txt" ]]; then
    echo "No z_env_config.txt file found"
    echo "Creating new one"

    touch z_env_config.txt

   echo $DEFAULT_NODE_ENV >> z_env_config.txt
   echo $VITE_NODE_ENV >> z_env_config.txt
   echo "" >> z_env_config.txt
   echo $LOGIN_DEFAULT >> z_env_config.txt
   echo "" >> z_env_config.txt
   echo $DEFAULT_DB_HOST >> z_env_config.txt
   echo $DEFAULT_DB_NAME >> z_env_config.txt
   echo $DEFAULT_DB_USER >> z_env_config.txt
   echo $DEFAULT_DB_PASSWORD >> z_env_config.txt
   echo $DEFAULT_DB_LIMIT >> z_env_config.txt
   echo "" >> z_env_config.txt   
   echo $DEFAULT_DISCORD_AT_DEVBOT >> z_env_config.txt
   echo "" >> z_env_config.txt   
   echo $SERVER_PORT >> z_env_config.txt
   echo $JWT_SECRET >> z_env_config.txt
   echo "" >> z_env_config.txt   
   echo $VITE_TARGET_API >> z_env_config.txt
   echo $VITE_PUBLIC_PATH >> z_env_config.txt
   echo $VITE_MAX_USER_AGE >> z_env_config.txt
   echo "" >> z_env_config.txt
   echo $PM2_NAME >> z_env_config.txt
   echo $PM2_INTERPRETER >> z_env_config.txt
   echo "" >> z_env_config.txt   
   echo "" >> z_env_config.txt   
   echo $MAX_IMAGE_COUNT >> z_env_config.txt
   echo $MAX_PDF_COUNT >> z_env_config.txt
   echo $MAX_VIDEO_COUNT >> z_env_config.txt
   echo "" >> z_env_config.txt   
   echo $MAX_IMAGE_SIZE >> z_env_config.txt
   echo $MAX_PDF_SIZE >> z_env_config.txt
   echo $MAX_VIDEO_SIZE >> z_env_config.txt
   echo $DISCORD_USED >> z_env_config.txt
   echo $ELECTRON_URL >> z_env_config.txt
fi

if [[ ! -f "z_env_config_staging.txt" ]]; then
    echo "No z_env_config_staging.txt file found"
    echo "Creating new one"

    touch z_env_config_staging.txt

    echo $DEFAULT_NODE_ENV >> z_env_config_staging.txt
    echo $VITE_NODE_ENV >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt
    echo $LOGIN_DEFAULT >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt
    echo $DEFAULT_DB_HOST >> z_env_config_staging.txt
    echo "$DEFAULT_DB_NAME"_dev >> z_env_config_staging.txt
    echo $DEFAULT_DB_USER >> z_env_config_staging.txt
    echo $DEFAULT_DB_PASSWORD >> z_env_config_staging.txt
    echo $DEFAULT_DB_LIMIT >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt   
    echo $DEFAULT_DISCORD_AT_DEVBOT >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt   
    echo $SERVER_PORT >> z_env_config_staging.txt
    echo $JWT_SECRET >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt   
    echo $VITE_TARGET_API >> z_env_config_staging.txt
    echo $VITE_PUBLIC_PATH >> z_env_config_staging.txt
    echo $VITE_MAX_USER_AGE >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt
    echo staging-"$PM2_NAME" >> z_env_config_staging.txt
    echo $PM2_INTERPRETER >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt   
    echo "" >> z_env_config_staging.txt   
    echo $MAX_IMAGE_COUNT >> z_env_config_staging.txt
    echo $MAX_PDF_COUNT >> z_env_config_staging.txt
    echo $MAX_VIDEO_COUNT >> z_env_config_staging.txt
    echo "" >> z_env_config_staging.txt   
    echo $MAX_IMAGE_SIZE >> z_env_config_staging.txt
    echo $MAX_PDF_SIZE >> z_env_config_staging.txt
    echo $MAX_VIDEO_SIZE >> z_env_config_staging.txt
    echo $DISCORD_USED >> z_env_config_staging.txt
    echo $ELECTRON_URL >> z_env_config_staging.txt
fi

if [[ "$1" == "--production" ]]; then
   cp z_env_config.txt .env

   cp .env ./server/.env
   cp .env ./uiv2/.env
   cp .env ./activity-tracker-app/.env
elif [[ "$1" == "--staging" ]]; then
   cp z_env_config_staging.txt .env

   cp .env ./server/.env
   cp .env ./uiv2/.env
   cp .env ./activity-tracker-app/.env
else
   echo "Usage --production | --staging"
fi
