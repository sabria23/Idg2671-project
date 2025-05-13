FROM node:18-alpine

WORKDIR /app/Backend

COPY . .

RUN npm install

EXPOSE 8000

CMD [ "node", "server.js"]