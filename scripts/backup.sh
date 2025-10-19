#!/bin/bash
set -e
name="$1"

if [[ ! -f ".env" ]]; then
    echo "No .env file found"
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

#  JOBS FOR BACKUP
function bakDatabase() {
   echo "Back up sql data [$SQL_DUMP_DIR]"
   mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME > $SQL_DUMP_DIR/$DB_NAME-$TIMESTAMP.sql || exitf "Failed to backupdata data of database, probably wrong credentials"
   gzip $SQL_DUMP_DIR/$DB_NAME-$TIMESTAMP.sql

   find $SQL_DUMP_DIR -type f -name "*.gz" -mtime +7 -exec rm {} \;
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

         server_dist_image=$(echo "$image" | sed "s|$arg2/||")
         image_path="$arg3/$server_dist_image"
         
         if [[ ! -d $image_path ]]; then
            mkdir -p $image_path
         fi

         cp -r $image/* $image_path || exitf "Failed to backup attachment [./server/dist/attachments/*] to [./bak/attachments]"
         printf "Success copying images...\n"
      fi
   fi


   if [[ -d $pdf ]]; then
      if [[ ! -z $(ls -A $pdf) ]]; then

         server_dist_pdf=$(echo "$pdf" | sed "s|$arg2/||")
         pdf_path="$arg3/$server_dist_pdf"

         if [[ ! -d $pdf_path ]]; then
            mkdir -p $pdf_path
         fi

         cp -r $pdf/* $pdf_path || exitf "Failed to backup attachment [./server/dist/attachments/*] to [./bak/attachments]"
         printf "Success copying pdf...\n"
      fi
   fi

   if [[ -d $video ]]; then
      if [[ ! -z $(ls -A $video) ]]; then

         server_dist_video=$(echo "$video" | sed "s|$arg2/||")
         video_path="$arg3/$server_dist_video"

         if [[ ! -d $video_path ]]; then
            mkdir -p $video_path
         fi

         cp -r $video/* $video_path || exitf "Failed to backup attachment [./server/dist/attachments/*] to [./bak/attachments]"
   
         printf "Success copying videos...\n"
      fi
   fi

   printf "Next operation\n\n"
}

function bakAttachments() {
    echo "Copying from backups..."
   server_dist="./server/dist/attachments"
   prefix="./bak/attachments"

   file_path=$(find $server_dist -mindepth 4 -maxdepth 4 -type d)
   # echo $file_path

   if [[ ! -z $file_path ]]; then
      count=0
      for i in $file_path;
      do
         if [[ ! -z $i ]]; then
            echo $i
            loopFiles $i $server_dist $prefix

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

   if [[ ! -z $(ls -A ./server/dist/logs) ]]; then
      printf "\nCopying logs from backups...\n"
      # rm  ./server/dist/logs
      cp -r ./server/dist/logs/* ./bak/logs || exitf "Failed to backup logs [./server/dist/logs/*] to [./bak/logs]"
      printf "\nSuccess copying logs...\n"
   fi

   # cp -r ./server/dist/attachments/* ./bak/attachments || exitf "Failed to backup attachment [./server/dist/attachments/*] to [./bak/attachments]"
}


if [[ "$name" == "database" ]]; then
   bakDatabase
elif [[ "$name" == "attachments" ]]; then
   bakAttachments
else
   echo "Usage:"
   echo "     attachments     - Backup attachements from [./server/dist/attachements] to [./back/attachments]"
   echo "     database        - Backuo database - MYSQL DUMP to [./back/sqldump]"
fi