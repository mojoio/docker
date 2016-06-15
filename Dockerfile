FROM hosttoday/ht-docker-node:lts
COPY ./node_modules /app-node/node_modules
COPY ./dist /app-node/dist 