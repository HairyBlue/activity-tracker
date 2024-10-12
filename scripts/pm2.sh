#!/bin/bash
set -e
current_dir="$(pwd)"
name="$1"

# ########################################################################################
# envs credentials
source .env

version="$(pm2 -v 2>&1 || echo 'not found')"

not_found="$(echo "$version" | grep -q 'not found' && echo 'true' || echo 'false')"

function print_error() {
    printf "\033[1;31m%s\033[0m" "$1"
}
function print_info() {
    printf "\033[1;32m%s\033[0m\n" "$1"
}

function exitf(){
    print_error "$1"
    exit 1
}


function infoPM2(){
   echo "PM2 installed, version: $(pm2 -v)"
   echo "Location: $(command -v pm2)"
}

function installPM2() {
   echo "installing pm2..."
   npm install pm2 -g
   infoPM2
}

function userInput() {
   read -r user_input
   user_input=$(echo "$user_input" | tr '[:upper:]' '[:lower:]')

   if [[ "$user_input" == "yes" ]]; then
      echo "*****************************************************************"
      print_info "BEGIN TO INSTALL - PM2"
      installPM2

   elif [[ "$user_input" == "no" ]]; then
      echo "You chose not to install pm2"
   else
      echo "Invalid response. Please enter 'Yes' or 'No'."
   fi
}


function startServices() {
   # stopingServices

   # "./svc.sh" build --notest || exitf "Error in building app"
   # cd "$current_dir"

   cd ./server/dist || exitf "no dist folder in server need to build first"

   infoPM2
   pm2 start app.js --interpreter=$PM2_INTERPRETER --name $PM2_NAME || exitf "There a problem starting the pm2 service for $PM2_NAME" 
   pm2 save
}

function stopingServices() {
   echo "Stopping service name - $PM2_NAME" || exitf "There a problem stopping the pm2 service for $PM2_NAME" 

   pm2 stop $PM2_NAME
   pm2 save
}

if [[ "$name" == "start" ]]; then
   if [[ "$not_found" == "true" ]]; then
      echo "PM2 not installed."
      echo "Do you want to install? (Yes/No)"

      userInput
   elif [[ "$not_found" == "false" ]]; then
      startServices
   fi

elif [[ "$name" == "stop" ]]; then
   stopingServices
fi


