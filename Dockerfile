# Base image
FROM node:22 AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:22

WORKDIR /app

# Install serve to serve the build folder
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"]