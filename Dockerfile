FROM node:lts

WORKDIR /app/activity-tracker

COPY . .

RUN chmod +x activity.sh

RUN activity.sh build

EXPOSE 3500

CMD ["activity.sh", "start"]