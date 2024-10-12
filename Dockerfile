FROM node:18.20.4

WORKDIR /app/activity-tracker

COPY . /app/activity-tracker

EXPOSE 3500

CMD ["node", "./server/dist/app.js"]