FROM node:22.11.0-alpine

WORKDIR /app

COPY package.json .

RUN apt-get update && apt-get install -y python3 make g++

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]