# build stage
FROM node:18.16.0-alpine as build-stage
RUN apk add --no-cache git
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --silent --cache-folder .ycache && rm -rf .ycache
COPY . .
ARG BUILD_MODE=production
RUN MODE=$BUILD_MODE yarn build --silent

# production stage
FROM nginx:1.23.3-alpine as production-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
