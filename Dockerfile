FROM node:18-alpine

WORKDIR /app

# Install server dependencies first
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy server code
COPY server/ ./server/

# Generate Prisma client
RUN cd server && npx prisma generate

# Install client dependencies and build React app
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Expose port 5000
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Set working directory to server
WORKDIR /app/server

# Run migrations, seed admin, and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node seed.js && node index.js"]