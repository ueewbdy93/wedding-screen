#!/bin/bash

echo "+-------------------+"
echo "| Heroku Post Build |"
echo "+-------------------+"

if [ ! -f ./src/config/config.json ]; then
  echo "Use config.sample.json"
  cp ./src/config/config.sample.json ./src/config/config.json
fi

npm run build