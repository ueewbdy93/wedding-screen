FROM node:10

RUN apt update && \
	apt install -y software-properties-common ca-certificates && \
	apt update && \
	apt install -y graphicsmagick

WORKDIR /usr/src/app
EXPOSE 5566
COPY . .
COPY ./src/config/config.sample.json ./src/config/config.json

RUN	npm install && \
	npm run build && \
	npm prune --production

ENV BUILD_IMAGE=Y
ENV TITLE="Happy Wedding"
VOLUME ["/usr/src/app/dist/config", "/usr/src/app/db", "/usr/src/app/src/public/images"]
CMD ["utils/docker-adapter.sh"]
