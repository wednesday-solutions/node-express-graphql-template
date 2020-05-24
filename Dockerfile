FROM node:13-alpine
RUN mkdir -p /app
ADD . /app
WORKDIR /app
RUN yarn
CMD ["sh", "./migrate-and-run.sh"]
EXPOSE 9000