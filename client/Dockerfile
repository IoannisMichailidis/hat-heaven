# Step 1: Build the frontend app
FROM node:16-alpine as builder

WORKDIR /app

COPY frontend/package*.json /app/
COPY frontend/src /app/src
COPY frontend/public /app/public

RUN npm install

RUN npm run build

# Step 2: Create lightweight image to serve with Node/Express
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/build ./frontend/build
COPY server.js ./
COPY package*.json ./

# Install only what's needed to serve (Express)
RUN npm install --only=production

EXPOSE 3000

CMD ["npm", "start"]
