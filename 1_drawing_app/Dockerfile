FROM node:10-alpine
WORKDIR /app
COPY package.json /app
COPY app.js /app
ADD public /app
ADD /figuresapp /app/figuresapp
ADD /saveimages/ /app/saveimages/
RUN npm install

CMD ["node", "app.js"]