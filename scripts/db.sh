#!/bin/bash
set -e
current_dir="$(pwd)"
echo $current_dir
if [[ ! -f ".env" ]]; then
    echo "No .env file found"
    echo "Build the service first"
    exit 1
fi

# ########################################################################################
# Database credentials
source .env
env="$NODE_ENV"

DB_USER="$MYSQL_DB_USER"
DB_PASSWORD="$MYSQL_DB_PASSWORD"
DB_NAME="$MYSQL_DB_NAME"

CNF_PATH=$(echo $current_dir"/scripts/activity_tracker.cnf")

# ########################################################################################
migrate_path="./sqls/migrate.sql"
reset_path="./sqls/reset-migrate.sql"
# migrate="npx ts-node ./src/utils/migration/migrate.ts"
# reset="npx ts-node ./src/utils/migration/reset.ts"  
seed="npx ts-node ./src/utils/seed.ts"
dummy="npx ts-node ./src/utils/dummy.ts"
# ########################################################################################

prodtext="Production only support usage of \033[1;32mmigrate\033[0m and \033[1;32mseed\033[0m"

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

if [[ "$1" == "-help" ]]; then
    printf "$text"
fi

if [[ ! -f $migrate_path ]]; then
    echo "$migrate_path not found"
elif [[ ! -f $reset_path ]]; then
    echo "$reset_path not found"
elif [[ "$env" == "production" ]]; then
    if [[ "$1" == "--migrate" ]]; then
        # $migrate
        # mysql -u$DB_USER -p$DB_PASSWORD -D$DB_NAME < $migrate_path || exitf "Failed to migrate database $migrate_path, probably wrong credentials"
        mysql --defaults-extra-file=$CNF_PATH < $migrate_path || exitf "Failed to migrate database $migrate_path, probably wrong credentials"
    elif [[ "$1" == "--seed" ]]; then
        cd "./server" #need to cd due the dependencies
        $seed
        cd "$current_dir" 
    else
        if [[ "$2" == "--webmaster-only" ]]; then
            if [[ "$1" == "reset" ]]; then                
                # mysql -u$DB_USER -p$DB_PASSWORD -D$DB_NAME < $reset_path || exitf "Failed to reset database $reset_path, probably wrong credentials"
                 mysql --defaults-extra-file=$CNF_PATH < $reset_path || exitf "Failed to reset database $reset_path, probably wrong credentials"
            elif [[ "$1" == "--dummy" ]]; then
                cd "./server"
                $dummy
                cd "$current_dir" 
            elif [[ "$1" == "--seed" ]]; then
                cd "./server"
                $seed
                cd "$current_dir" 
            else
                printf "$text"
            fi
        else
            printf "$prodtext"
        fi
    fi
elif [[ "$env" == "development" ]]; then
    if [[ "$1" == "--migrate" ]]; then
        # mysql -u$DB_USER -p$DB_PASSWORD -D$DB_NAME < $migrate_path || exitf "Failed to migrate database $migrate_path, probably wrong credentials"
        mysql --defaults-extra-file=$CNF_PATH < $migrate_path || exitf "Failed to migrate database $migrate_path, probably wrong credentials"
    elif [[ "$1" == "--reset" ]]; then
        # mysql -u$DB_USER -p$DB_PASSWORD -D$DB_NAME < $reset_path || exitf "Failed to reset database $reset_path, probably wrong credentials"
        mysql --defaults-extra-file=$CNF_PATH < $reset_path || exitf "Failed to reset database $reset_path, probably wrong credentials"
    else
        cd "./server" #need to cd due the dependencies
        if [[ "$1" == "--dummy" ]]; then
            $dummy
        elif [[ "$1" == "--seed" ]]; then
            $seed
        fi

        cd "$current_dir" 
    fi
fi
