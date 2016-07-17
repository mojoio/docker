FROM hosttoday/ht-docker-node:npmts
RUN mkdir app-node
COPY ./ /app-node/
WORKDIR /app-node
ENV CI true
CMD ["npmci","install","stable"]