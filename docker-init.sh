#!/bin/bash

export NODE_ENV=developement

# install
[ -d node_modules ] || \
	git submodule update --init && npm install && npm install && npm run build \
	&& npm install --prefix frontend/ && npm run build --prefix frontend/

# flush database
rm -f db-wedding.sqlite

npm run build && npm start
