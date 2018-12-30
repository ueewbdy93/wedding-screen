FROM node:lts
ENV NODE_ENV developement
WORKDIR /usr/src/app
VOLUME "/usr/src/app"
EXPOSE 5566
CMD /usr/src/app/docker-init.sh
