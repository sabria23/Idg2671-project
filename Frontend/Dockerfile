# Simple frontend Dockerfile - development mode only
FROM node:16-alpine

WORKDIR /app/Frontend

# Copy package files first for better caching
COPY package*.json ./

# Create .npmrc file to skip optional dependencies
RUN echo "omit=optional" > .npmrc

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3030

# Run in development mode
CMD ["npm", "run", "dev", "--", "--host"]
