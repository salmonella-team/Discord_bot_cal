FROM node:14.21.1-buster

WORKDIR /usr/app

COPY . .
RUN npm install
RUN npm run build
CMD npm start
