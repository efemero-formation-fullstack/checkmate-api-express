FROM node:22-alpine

WORKDIR /app

# Copy package components
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose API port
EXPOSE 8080

# Start command
CMD ["npm", "start"]
