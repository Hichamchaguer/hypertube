FROM node:20-slim

WORKDIR /app
RUN apt-get update && apt-get install -y netcat-openbsd
COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3002

COPY script.sh ./
RUN chmod +x script.sh

CMD ["sh","./script.sh"]