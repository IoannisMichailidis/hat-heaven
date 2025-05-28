# Step 1: Base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy Dependencies
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of required files and directories
COPY . .

# Command to run the application
CMD ["npm", "start"]