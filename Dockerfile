FROM node:18

WORKDIR /app

COPY . .

WORKDIR /app/server

RUN npm install

RUN npx prisma generate

WORKDIR /app/client

RUN npm install

RUN npm run build

WORKDIR /app/server

EXPOSE 5000

ENV NODE_ENV=production

CMD npx prisma migrate deploy && node seed.js && node index.js