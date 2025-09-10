# Use official Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start the service
CMD ["npm", "start"]