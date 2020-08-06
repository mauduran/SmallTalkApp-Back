FROM node:12.18.1

WORKDIR /usr/src/small-talk-backend

COPY  ./ ./

RUN npm install

CMD [ "bin/bash" ]