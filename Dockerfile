# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
# Using package-lock.json* to ensure it uses package-lock.json if available
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# Environment variables required at runtime (like Firebase keys)
# will be injected by Docker Compose, not at build time here.
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Set environment to production for Next.js
ENV NODE_ENV production

# Copy built assets and necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js runs on (default for `npm start` is 3000)
EXPOSE 3000

# Command to run the application
# `npm start` executes `next start` as defined in package.json
CMD ["npm", "start"]
