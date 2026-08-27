FROM node:20-alpine
WORKDIR /app

COPY tsconfig.json ./

COPY shared-services ./shared-services
WORKDIR /app/shared-services
RUN npm install
RUN npm install typescript -g
RUN tsc

WORKDIR /app
COPY services/api-gateway ./services/api-gateway

WORKDIR /app/services/api-gateway

RUN npm install
RUN npm install dotenv
RUN npm install dotenv redis
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]