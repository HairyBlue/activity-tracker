#!/bin/bash
set -e
current_dir="$(pwd)"
name="$1"

# ########################################################################################
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

function electron() {
    cd "$current_dir"
    win32x64=$(ls ./activity-tracker-app/out/make/squirrel.windows/x64/activity-tracker-app-*Setup.exe)

    if [[ "$1" == "--build" ]]; then
        cd ./activity-tracker-app

        echo "Building and package for electron app"
        npm install  || exitf "failed to install packages for electron"
        npm run make || exitf "failed to make electron app for windows"

        cd "$current_dir"
    fi

    if [[ -n "$win32x64" ]]; then
        echo "Copy Setup exe file to public dist"
        cp "$win32x64" ./server/dist/public || exitf "No Setup exe file found to copy."
    fi

    cd "$current_dir"
}

function cleanBuild() {
    cd "$current_dir"

    echo "Cleaning up server for new build"
    cd ./server
    rm -rf node_modules || exitf "Unable to remove node_modules from server"
    rm -f package-lock.json || exitf "Unable to removepackage-lock.json from server"

    cd "$current_dir"
    echo "Cleaning up ui for new build"
    cd ./uiv2
    rm -rf node_modules || exitf "Unable to remove node_modules from uiv2"
    rm -f package-lock.json || exitf "Unable to removepackage-lock.json from uiv2"

    cd "$current_dir"
    echo "Successfuly cleanBuild"
}


function buildServer(){
    cd "$current_dir"
    cd "$1" || exitf "no server directory found"

    echo "Building Server"
    echo "The current working directory"
    print_info "$(pwd)"

    npm install
    rm -rf dist
    npm run build

    if [[ -f ".env" ]]; then
        cp .env ./dist
    fi

    cp -r ./src/settings ./dist
    mkdir ./dist/attachments
    mkdir ./dist/logs
    
    if [[ "$2" != "--notest" ]]; then
        npm run test
    fi
    cd "$current_dir"
}

function buildUI(){
    cd "$current_dir"
    cd "$1" || exitf "no ui directory found"

    echo "Building UI"
    echo "The current working directory"
    print_info "$(pwd)"

    npm install
    rm -rf dist
    npm run build
    cd "$current_dir"
}

function start(){
    cd ./server/dist || exitf "no dist folder in server need to build first"
    node app.js
}

if [[ "$#" -eq 0 ]]; then
    exitf "No arguments found. Do '-help'"
fi

if [[ "$name" == "build" ]]; then

    if [[ "$2" == "--clean" ]]; then
        cleanBuild
    elif [[ "$2" == "--notest" ]]; then
        buildUI "./uiv2"
        buildServer "./server" "--notest"
        cp -r ./uiv2/dist server/dist/public || exitf "cannot copy uiv2 > dist to  server > dist > public"
    else
        buildUI "./uiv2"
        buildServer "./server" "--notest"
        cp -r ./uiv2/dist server/dist/public || exitf "cannot copy uiv2 > dist to  server > dist > public"
    fi
   
    # print_info "Copy backup attachements [./bak/attachements/*] to ['./server/dist/attachements']"
    # ./tagBackup.sh attachments

elif [[ "$name" == "start" ]]; then
    start
elif [[ "$name" == "nobuild" ]]; then
    buildServer "./server" "--notest"
    start
elif [[ "$name" == "electron" ]]; then
    if [[ "$2" == "--build" ]]; then
         electron "--build"
    else
        electron
    fi
elif [[ "$name" == "--help" ]]; then
    # printf "The usage of this script:\n \033[1;32mbuild\033[0m \t- to build the app\n \033[1;32mstart\033[0m \t- to start the app\n \033[1;32mnobuild\033[0m \t- build on server and and start the app"
    echo "The used of this script ff:"
    echo "start             - for running the services"
    echo "nobuild           - only build the server not the ui for fast testing for server"
    echo "build             - build the services and do test runners"
    echo "build --notest    - build the services and no test runner"
    echo "build --clean     - remove depedencies in both server and uiv2 afterward build sever and uiv2"
    echo "electron          - copy the zip file to server dist"
    echo "electron --build  - build the electron app and copy file"
elif [[ "$name" =~ ^.*help.* ]]; then
    printf "Did you mean '--help' ?"
else
    echo "The used of this script ff:"
    echo "start             - for running the services"
    echo "nobuild           - only build the server not the ui for fast testing for server"
    echo "build             - build the services and do test runners"
    echo "build --notest    - build the services and no test runner"
    echo "build --clean     - remove depedencies in both server and uiv2 afterward build sever and uiv2"
    echo "electron          - build the electron app and copy the zip file to server dist"
    echo "electron --build  - build the electron app and copy file"
fi