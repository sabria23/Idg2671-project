
FROM node:18-alpine

WORKDIR /app/Frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030

# Run in development mode
CMD ["npm", "run", "dev", "--", "--host"]
