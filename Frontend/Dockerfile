# Build the static frontend
FROM node:20

WORKDIR /app/Frontend

COPY . .

RUN npm install --platform=linux --arch=x64 || npm install --no-optional

EXPOSE 3030

CMD ["npm", "run", "dev", "--", "--host"]