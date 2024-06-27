FROM node:18
ARG ENVIRONMENT_NAME
ARG BUILD_NAME
ARG APP_PATH
ARG PLATFORM
ENV NODE_OPTIONS=--openssl-legacy-provider

# RUN mkdir -p /app-build
# ADD . /app-build
# WORKDIR /app-build
RUN mkdir -p ${APP_PATH}
ADD . ${APP_PATH}
WORKDIR ${APP_PATH}
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile
RUN yarn
RUN yarn build:$BUILD_NAME


FROM node:18-alpine
ARG ENVIRONMENT_NAME
ARG BUILD_NAME
ARG APP_PATH
ARG PLATFORM
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR ${APP_PATH}
RUN mkdir -p ${APP_PATH}/dist
RUN apk add yarn
RUN yarn global add sequelize-cli@6.2.0 nyc@15.1.0
RUN yarn add shelljs bull dotenv pg sequelize@6.6.5
ADD scripts/migrate-and-run.sh ${APP_PATH}/
ADD package.json ${APP_PATH}/
ADD . ./
COPY --from=0 ${APP_PATH}/dist ${APP_PATH}/dist
ADD https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/assets/freeze_time_$PLATFORM.so /lib/keploy/freeze_time_$PLATFORM.so
RUN chmod +x /lib/keploy/freeze_time_$PLATFORM.so
ENV LD_PRELOAD=/lib/keploy/freeze_time_$PLATFORM.so

STOPSIGNAL SIGINT

CMD ["sh", "./migrate-and-run.sh"]
EXPOSE 9000
