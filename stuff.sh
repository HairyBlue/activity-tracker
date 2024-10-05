#!/bin/bash
set -e
name="$1"

generatePassword="npx ts-node ./server/src/utils/stuff/generatePassword.ts"
generateToken="npx ts-node ./server/src/utils/stuff/generateToken.ts"
generateUUID="npx ts-node ./server/src/utils/stuff/generateUUID.ts"

fileUpload="nodemon ./server/src/utils/playAround/fileUpload.ts"

if [[ "$name" == "password" ]]; then
   $generatePassword

elif [[ "$name" == "token" ]]; then
   $generateToken
elif [[ "$name" == "fileUpload" ]]; then
   $fileUpload
elif [[ "$name" == "uuid" ]]; then
   $generateUUID
fi