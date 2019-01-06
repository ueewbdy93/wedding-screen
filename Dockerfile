FROM node:10
ENV NODE_ENV development
WORKDIR /usr/src/app
EXPOSE 5566
COPY . .
COPY ./src/config/config.sample.json ./src/config/config.json
RUN npm install && npm run build \
  && npm install --prefix frontend/ \
  && npm run build --prefix frontend/ 
VOLUME ["/usr/src/app/dist/config", "/usr/src/app/db", "/usr/src/app/public/images"]
CMD [ "npm", "start" ]
