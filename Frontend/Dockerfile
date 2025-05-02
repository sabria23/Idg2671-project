# Build the static frontend
FROM node:18

WORKDIR /app/Frontend

COPY . .

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "dev", "--", "--host"]