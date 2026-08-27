FROM node:20-alpine
WORKDIR /app

COPY tsconfig.json ./

COPY shared-services ./shared-services
WORKDIR /app/shared-services
RUN npm install
RUN npm install typescript -g
RUN tsc

WORKDIR /app
COPY services/message-service ./services/message-service

WORKDIR /app/services/message-service

RUN npm install
RUN npm install dotenv
RUN npm run build

CMD ["npm", "start"]