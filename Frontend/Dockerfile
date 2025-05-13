FROM node:20

WORKDIR /app/Frontend

COPY package*.json ./
RUN npm install --no-optional

COPY . .

# Set the environment variable for Vite build
ENV VITE_API_URL=https://group4-api.sustainability.it.ntnu.no

EXPOSE 80

# Install serve
RUN npm install -g serve

# Build the app and then serve it
CMD npm run build && serve -s dist -l 80