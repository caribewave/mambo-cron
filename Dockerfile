FROM node:9

RUN mkdir -p /opt/mambo/tiles

COPY ./index.js /opt/mambo/
COPY ./package.json /opt/mambo/
COPY ./src /opt/mambo/src

WORKDIR /opt/mambo

RUN npm install

EXPOSE 8082
CMD npm start
