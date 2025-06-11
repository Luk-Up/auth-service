# Step 1: Use the official Node.js image as the base image
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only=production

COPY . .

FROM node:18-alpine AS final

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app .

EXPOSE 5000

CMD ["node", "server.js"]

