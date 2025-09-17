FROM node:22.17.0 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli

COPY . .

RUN npm run build -- --configuration production
RUN echo "Building Angular app with configuration: $ENV" && \
    ng build --configuration=$ENV

FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/miming-dapp/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
