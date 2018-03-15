FROM node:9

RUN mkdir -p /opt/mambo/conf
WORKDIR /opt/mambo

COPY ./index.js /opt/mambo/
COPY ./assets /opt/mambo/assets
COPY ./package.json /opt/mambo/
COPY ./lib /opt/mambo/lib

RUN npm install

EXPOSE 8082
CMD npm start
