FROM node:18-alpine

WORKDIR /app

# Copy everything from the root first
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Install client dependencies and build React app
WORKDIR /app/client
RUN npm install
RUN npm run build

# Go back to server directory for running
WORKDIR /app/server

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Run migrations, seed, and start
CMD ["sh", "-c", "npx prisma migrate deploy && node seed.js && node index.js"]