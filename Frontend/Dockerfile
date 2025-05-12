# Stage 1: Build the frontend
FROM node:18 AS builder
WORKDIR /app/Frontend

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --no-optional

# Copy the rest of the application and build it
COPY . .
RUN npm run build

# Stage 2: Serve the frontend
FROM node:18-alpine
WORKDIR /app

# Install serve to run the built application
RUN npm install -g serve

# Copy only the built application from the previous stage
COPY --from=builder /app/Frontend/dist /app/dist

EXPOSE 3030

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3030"]

