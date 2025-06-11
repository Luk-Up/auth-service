# Step 1: Use the official Node.js image as the base image
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install --only=production

COPY . .

FROM node:18-alpine AS final

COPY --from=builder /app /app

WORKDIR /app

EXPOSE 5000

CMD ["node", "server.js"]

