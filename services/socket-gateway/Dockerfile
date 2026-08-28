FROM node:20-alpine
WORKDIR /app

# 1. Main root config file copy karein (TS Error fix karne ke liye)
COPY tsconfig.json ./

COPY shared-services ./shared-services
WORKDIR /app/shared-services
RUN npm install
RUN npm install typescript -g
RUN tsc


WORKDIR /app
COPY services/socket-gateway ./services/socket-gateway

WORKDIR /app/services/socket-gateway

RUN npm install
RUN npm install dotenv
RUN npm run build
RUN mkdir -p node_modules/@shared && (cp -r /app/shared-services/dist/* node_modules/@shared/ 2>/dev/null || cp -r /app/shared-services/* node_modules/@shared/ 2>/dev/null || true)
EXPOSE 5001
CMD ["npm", "start"]
