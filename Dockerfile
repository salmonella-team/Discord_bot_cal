FROM node:14.21.1-buster

WORKDIR /usr/app

#ログの表示をJSTに変更する
RUN apt-get update && apt install -y tzdata && apt-get clean && rm -rf /var/lib/apt/lists/*
ENV TZ Asia/Tokyo

COPY . .
RUN npm install
RUN npm run build
CMD npm start
