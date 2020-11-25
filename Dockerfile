FROM node:8-alpine
WORKDIR /app
COPY . .
RUN npm install
#ENV PORT 8080
#ENV API_URL http://192.168.1.71:8080/api
#EXPOSE 8080
CMD [ "npm", "start" ]