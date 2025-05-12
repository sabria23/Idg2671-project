FROM node:20

WORKDIR /app/Frontend

COPY package*.json ./
RUN npm install --no-optional

COPY . .

EXPOSE 80

# Install serve
RUN npm install -g serve

# Build the app and then serve it
CMD npm run build && serve -s dist -l 80