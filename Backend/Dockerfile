# https://mihirpopat.medium.com/understanding-dockerfiles-workdir-instruction-best-practices-and-pitfalls-1531bca48d3f
FROM node:18-alpine

WORKDIR /app/Backend

COPY . .

RUN npm install

EXPOSE 8000

CMD [ "node", "server.js"]