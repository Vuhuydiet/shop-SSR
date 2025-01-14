FROM node:22-slim

RUN apt-get update && \
apt-get install -y openssl && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:gen
RUN npm run genkey

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]