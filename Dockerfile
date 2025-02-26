FROM nginx:stable-alpine
COPY . /usr/share/nginx/html
COPY /config/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]