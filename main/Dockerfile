FROM mhart/alpine-node:latest

RUN mkdir /main 
WORKDIR /main

COPY package.json /main
COPY .env /main

RUN npm install