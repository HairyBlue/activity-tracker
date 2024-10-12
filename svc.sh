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

function help() {
    echo "The used of this script ff:"
    echo ""
    echo "[1]-first argument"
    echo "[2]-second argument"
    echo "[3]-third argument"
    echo "ex: ./svc.sh [1] (./svc.sh start) --or-- ./svc.sh [1] [2] (./svc.sh build --notest)"
    echo ""
    echo "[1]: start"
    echo "[1]: pm2               => [2]--start   | [2]--stop"
    echo "[1]: build             => [2]--test    | [2]--notest | [3]--staging | [3]--production"
    echo "[1]: clean-build       => [2]--test    | [2]--notest | [3]--staging | [3]--production"
    echo "[1]: electron          => [2]--build"
    echo "[1]: database          => [2]--migrate | [2]--reset  | [2]--dummy   | [2]--seed | [3]--webmaster-only"
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
    
    if [[ "$2" == "--test" ]]; then
        npm run test
    fi

    cd "$current_dir"
}

function buildUI() {
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

function build() {
    arg1="$1"
    arg2="$2"

    if [[ "$arg2" == "--staging" ]]; then
        ./scripts/env.sh  "--staging"
    elif [[ "$arg2" == "--production" ]]; then
        ./scripts/env.sh  "--production"
    fi


    if [[ "$arg1" == "--notest" ]]; then
        buildServer "./server"
    elif [[ "$arg1" == "--test" ]]; then
        buildServer "./server" "--test"
    else
        exitf "Cannot be build, there is no or invalid second positional argument. Do '--help'"
    fi

    buildUI "./uiv2"
    echo "copying ./uiv2/dist to ./serverdist/public"
    cp -r ./uiv2/dist server/dist/public || exitf "cannot copy uiv2 > dist to  server > dist > public"
    echo "...DONE"
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

    build $1 $2
}



function pm2() {
    if [[ "$1" == "--start" ]]; then
        ./scripts/pm2.sh "start"
    elif [[ "$1" == "--stop"  ]]; then
        ./scripts/pm2.sh "stop"
    else
        echo "Usage: --start | --stop"
    fi
}

function start() {
    cd ./server/dist || exitf "no dist folder in server need to build first"
    node app.js
}

function database() {
    if [[ "$1" == "--migrate" ]]; then
        ./scripts/db.sh $1
    elif [[ "$1" == "--reset" ]]; then
        ./scripts/db.sh $1 $2
    elif [[ "$1" == "--dummy" ]]; then
        ./scripts/db.sh $1 $2
    elif [[ "$1" == "--seed" ]]; then
        ./scripts/db.sh $1 $2
    fi
}

if [[ "$#" -eq 0 ]]; then
    exitf "No arguments found. Do '--help'"
fi

if [[ "$name" == "start" ]]; then
    start
elif [[ "$name" == "pm2" ]]; then
    pm2 $2
elif [[ "$name" == "build" ]]; then
    build $2 $3
elif [[ "$name" == "clean-build" ]]; then
    clean $2 $3
elif [[ "$name" == "electron" ]]; then
    electron $2
elif [[ "$name" == "database" ]]; then
    database $2 $3
elif [[ "$name" == "--help" ]]; then
    help
elif [[ "$name" =~ ^.*help.* ]]; then
    printf "Did you mean '--help' ?"
else
    exitf "Invalid argument. Do '--help'"
fi