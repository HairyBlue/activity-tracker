#!/bin/bash
set -e
current_dir="$(pwd)"
name="$1"

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

function buildServer(){
    cd "$1" || exitf "no server directory found"

    echo "The current working directory"
    print_info "$(pwd)"

    npm install
    rm -rf dist
    npm run build

    if [[ ! -f ".env" ]]; then
        exitf "No .env found on the server. Need to add"
    fi

    cp .env ./dist
    cp -r ./src/settings ./dist

    npm run test
}

function buildUI(){
    cd "$1" || exitf "no ui directory found"

    echo "The current working directory"
    print_info "$(pwd)"

    npm install
    rm -rf dist
    npm run build
}

function start(){
    cp -r ui/dist server/dist/public || exitf "cannot copy ui dist to public need to build first"
    cd server/dist || exitf "no dist folder in server need to build first"
    node app.js
}


if [[ "$#" -eq 0 ]]; then
    exitf "No arguments found. Do '-help'"
fi

if [[ "$name" == "build" ]]; then
    buildServer "./server"
    cd "$current_dir"
    buildUI "./ui"
elif [[ "$name" == "start" ]]; then
    start
elif [[ "$name" == "-help" ]]; then
    printf "The usage of this script:\n \033[1;32mbuild\033[0m \t- to build the app\n \033[1;32mstart\033[0m \t- to start the app"
else
    printf "Usage: \033[1;32mbuild\033[0m OR \033[1;32mstart\033[0m"
fi