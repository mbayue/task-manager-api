FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm ci
EXPOSE 3000
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]