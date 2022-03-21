FROM node:16.14.2
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY app.js .
EXPOSE 12000
CMD [ "node", "app.js" ]