FROM node:23-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build
RUN ls -la /app/dist

EXPOSE 4173

CMD ["sh", "-c", "npm run preview"]