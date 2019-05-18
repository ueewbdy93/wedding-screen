#!/bin/bash

set -e

echo "+-------------------+"
echo "| Heroku Pre Build  |"
echo "+-------------------+"

if [ "x${DOWNLOAD_URL}" = "x" ]; then
  echo "Miss DOWNLOAD_URL. Skip pre build process."
  exit 0
fi

echo "Read DOWNLOAD_URL: ${DOWNLOAD_URL}"

if [[ $DOWNLOAD_URL =~ https://drive.google.com ]]; then
  id=`node -e "console.log(querystring.parse(new URL(\"$DOWNLOAD_URL\").search.slice(1)).id)"`
  if [ "x$id" != "x" ]; then
    DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=$id"
  fi
fi

echo "Download from ${DOWNLOAD_URL}"

mkdir /tmp/wedding
curl -L -o /tmp/wedding/file.zip ${DOWNLOAD_URL}
unzip /tmp/wedding/file.zip -d /tmp/wedding
rm -f /tmp/wedding/file.zip
rm -f ./src/config/config.json
rm -rf ./src/public/images/*
find /tmp/wedding -name 'config.*' | xargs -I '{}' mv '{}' ./src/config/config.json
# find /tmp/wedding -type f -not -path '*/\.*' | xargs -I '{}' mv '{}' ./src/public/images/
find /tmp/wedding/ -type d -name normal ! -path '*MACOS*' | xargs -I '{}' mv '{}' ./src/public/images
find /tmp/wedding/ -type d -name blur ! -path '*MACOS*' | xargs -I '{}' mv '{}' ./src/public/images
rm -rf /tmp/wedding