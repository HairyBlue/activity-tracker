FROM node:lts

WORKDIR /app/activity-tracker

COPY . .

RUN cd ui && npm install && npm run build

RUN cd server && npm install && npm run build

# Run tests for UI and server
# RUN cd ui && npm test
RUN cd server && npm test

COPY ui/dist ./server/dist/public

EXPOSE 3500

CMD ["node", "./server/dist/app.js"]