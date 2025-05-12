FROM node:18-alpine

WORKDIR /app/Frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030

CMD ["npm", "run", "dev", "--", "--host"]