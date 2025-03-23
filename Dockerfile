# Step 1: Base image
FROM node:16-alpine as builder

# Set the working directory
WORKDIR /app

# Copy required files and directories
COPY package*.json /app/
COPY frontend/package*.json /app/frontend/
COPY frontend/src /app/frontend/src
COPY frontend/public /app/frontend/public

# Install frontend and backend dependencies and build the frontend
RUN npm run build

# Step 2: Setup for production
FROM node:16-alpine

WORKDIR /app

# Copy backend code and built frontend from the builder stage
COPY backend /app/backend
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/frontend/build /app/frontend/build
COPY backend ./backend
COPY uploads ./uploads
COPY .gitignore ./
COPY package*.json ./

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
