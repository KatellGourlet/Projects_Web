FROM node:10-alpine
WORKDIR /app
COPY package.json .
COPY app.js .
ADD public .
ADD /saveimages
RUN npm install

#Run the server as a non-root user
#RUN adduser -D myuser
#USER myuser

CMD ["node", "app.js"]