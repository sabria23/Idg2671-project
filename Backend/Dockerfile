FROM node:18-alpine

WORKDIR /app/Backend

COPY . .

COPY .env /app/.env  

RUN npm install

EXPOSE 8000

CMD [ "node", "server.js"]