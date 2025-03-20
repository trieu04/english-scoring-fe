# Build Stage
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install --frozen-lockfile

COPY ./ /app
RUN yarn run build

# Production Stage
FROM nginx:1.21.6-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/ /var/www

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
