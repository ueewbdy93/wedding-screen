FROM node:10

WORKDIR /usr/src/app
EXPOSE 5566
COPY . .
COPY ./src/config/config.sample.json ./src/config/config.json
RUN npm install && npm run build
RUN npm prune --production

VOLUME ["/usr/src/app/dist/config", "/usr/src/app/db", "/usr/src/app/dist/public/images"]
CMD [ "npm", "start" ]
