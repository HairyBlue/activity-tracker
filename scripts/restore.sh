#!/bin/bash
set -e
name="$1"

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

# ########################################################################################
# Backup directory
BACKUP_DIR="./bak"
ATTACHMENT_DIR="./bak/attachments"
LOG_DIR="./bak/logs"
SQL_DUMP_DIR="./bak/sqldump"
# ########################################################################################

# Timestamp (to create unique backup filenames)
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
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


if [[ ! -d "$BACKUP_DIR" ]]; then
   echo "Creating Backup Directory (name: bak)"
   mkdir bak
fi

if [[ ! -d "$ATTACHMENT_DIR" ]]; then
   echo "Creating Backup Directory For Attatchment (/bak/attachments)"
   mkdir bak/attachments
fi

if [[ ! -d "$LOG_DIR" ]]; then
   echo "Creating Backup Directory For Logs (/bak/logs)"
   mkdir bak/logs
fi

if [[ ! -d "$SQL_DUMP_DIR" ]]; then
   echo "Creating Backup Directory For SQL DUMP (/bak/sqldump)"
   mkdir bak/sqldump
fi


# COPYING FROM BACKUP
function restoreDatabase() {
   latest_file=$(find "$SQL_DUMP_DIR" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2)
   # file_check=$(grep -q '/*\.gz/' && echo 'true' || echo 'false')
   if [[ "$latest_file"  == *.gz ]]; then
      echo $latest_file
      gunzip $latest_file 
      sleep 2
      latest_file="${latest_file%.gz}"
      mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < $latest_file || exitf "Failed to feed data from $latest_file to database, probably wrong credentials"
      sleep 2
      gzip $latest_file
   elif [[ "$file_check"  == "false" ]]; then
      echo "Unable to dump data to mysql"
   fi
}



function loopFiles(){
   print_info "Prepare operation"
   arg1="$1"
   arg2="$2"
   arg3="$3"

   image="$arg1/images"
   pdf="$arg1/pdfs"
   video="$arg1/videos"

   if [[ -d $image ]]; then
      if [[ ! -z $(ls -A $image) ]]; then

         server_dist_image=$(echo "$image" | sed "s|$prefix/||")
         image_path="$arg3/$server_dist_image"
   
         if [[ ! -d $image_path ]]; then
            mkdir -p $image_path
         fi

         cp $image/* $image_path || exitf "Failed to copy backup attachment [$image]  to  [./server/dist/attachments]"
         printf "Success copying images...\n"
      fi
   fi


   if [[ -d $pdf ]]; then
      if [[ ! -z $(ls -A $pdf) ]]; then
         server_dist_pdf=$(echo "$pdf" | sed "s|$prefix||")
         pdf_path="$arg3/$server_dist_pdf"

         if [[ ! -d $pdf_path ]]; then
            mkdir -p $pdf_path
         fi

         cp -r $pdf/* $pdf_path || exitf "Failed to copy backup attachment [./bak/attachments/*]  to  [./server/dist/attachments]"
         printf "Success copying pdfs...\n"
      fi
   fi

   if [[ -d $video ]]; then
      if [[ ! -z $(ls -A $video) ]]; then
         server_dist_video=$(echo "$video" | sed "s|$prefix||")
         video_path="$arg3/$server_dist_video"

         if [[ ! -d $video_path ]]; then
            mkdir -p $video_path
         fi
         
         cp -r $video/* $video_path || exitf "Failed to copy backup attachment [./bak/attachments/*]  to  [./server/dist/attachments]"
         printf "Success copying videos...\n"
      fi
   fi

   printf "Next operation\n\n"
}


function restoreAttachements() {
   echo "Copying attachments from backups..."
   
   server_dist="./server/dist/attachments"
   prefix="./bak/attachments"

   file_path=$(find $prefix -mindepth 4 -maxdepth 4 -type d)

   if [[ ! -z $file_path ]]; then
      count=0
      for i in $file_path;
      do
         if [[ ! -z $i ]]; then
            echo $i
            loopFiles $i $prefix $server_dist

            count=$((count + 1))

            if ((count % 10 == 0)); then
                echo "Sleeping for 1 second after processing 10 files..."
                sleep 1  # Sleep for 1 second after every 10 files
            else 
               echo "Sleeping for 0.1 second on processing 10 files..."
                sleep 0.1  # Sleep for 1 second after every 10 files
            fi

         fi
      done
   fi


   if [[ ! -z $(ls -A ./bak/logs) ]]; then
      printf "\nCopying logs from backups...\n"
      # rm  ./server/dist/logs
      cp -r ./bak/logs/* ./server/dist/logs || exitf "Failed to copy backup logs [./bak/logs/*] to [./server/dist/logs]"
      printf "Success copying logs...\n"
   fi
}


if [[ "$name" == "attachments" ]]; then
   restoreAttachements
elif [[ "$name" == "database" ]]; then
   restoreDatabase
else
   echo "Usage:"
   echo "     attachments     - Restore attachements from [./back/attachments] to [./server/dist/attachements]"
   echo "     database        - Restore dump data from [./back/sqldump] latest file to MYSQL DATABASE"
fi
