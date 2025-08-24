# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the results directory
RUN mkdir -p results

# Expose port 3000 (in case you want to add a web interface later)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
