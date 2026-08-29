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
RUN cp -r src/certs dist/ || true
RUN mkdir -p node_modules/@shared && (cp -r /app/shared-services/dist/* node_modules/@shared/ 2>/dev/null || cp -r /app/shared-services/* node_modules/@shared/ 2>/dev/null || true)

EXPOSE 5000
CMD ["npm", "start"]
