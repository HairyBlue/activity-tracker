#!/bin/bash
set -e
current_dir="$(pwd)"
source .env
env="$NODE_ENV"

migrate="npx ts-node ./src/utils/migration/migrate.ts"
reset="npx ts-node ./src/utils/migration/reset.ts"  
seed="npx ts-node ./src/utils/migration/seed.ts"
dummy="npx ts-node ./src/utils/migration/dummy.ts"

prodtext="Production only support usage of \033[1;32mmigrate\033[0m and \033[1;32mseed\033[0m"
text="Usage for development and staging/testing:\n\n migrate\t - for migration\n reset\t- for reseting database\n seed\t- for seeding clubs/orgs and category\n dummy\t- for seeding dummy data for testing\n fast\t - run all command"


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

if [[ "$#" -eq 0 ]]; then
    exitf "No arguments found. Do '-help'"
fi

if [[ "$env" == "production" ]]; then
    cd "./server" #need to cd due the dependencies
    if [[ "$1" == "migrate" ]]; then
        $migrate
    elif [[ "$1" == "seed" ]]; then
        $seed
    else
        printf "$prodtext"
    fi

    cd "$current_dir"
elif [[ "$env" == "staging" || "$env" == "development" ]]; then
    cd "./server" #need to cd due the dependencies

    if [[ "$1" == "fast" ]]; then
        $reset
        $seed
        $dummy
    elif [[ "$1" == "migrate" ]]; then
        $migrate
    elif [[ "$1" == "seed" ]]; then
       $reset
    elif [[ "$1" == "dummy" ]]; then
        $dummy
    elif [[ "$1" == "reset" ]]; then
        $reset
    else
        printf "$text"
    fi

    cd "$current_dir"
elif [[ "$1" == "-help" ]]; then
    printf "$text"
else
    exitf "no env found"
fi