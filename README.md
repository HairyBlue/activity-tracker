# Activity Tracker

## Purpose

This repo serve as my project on 'Software Engeenering 1' subject
Main purpose is to track activities on clubs and organization for schools

## Project Setup

### Server
```bash
cd server
npm install
npm run build
cd .. # return to root
```

### UI
```bash
cd ui
npm install
npm run build
cd .. # return to root
```

### Test

```bash
cd server 
npm test
cd .. # return to root
```

### Usage

```bash
rm -rf server/dist/public
cp -r ui/dist server/dist/public
cd server/dist
node app.js
```

## Using with PM2 and PM2 Windows Service

[reference for the pm2 setup](https://profoundlogicsupport.atlassian.net/wiki/spaces/PUI/pages/164514058/Autostart+Profoundjs+with+PM2#Installing-PM2)

### Usage

```bash
cd server
pm2 start pm2.config.js
pm2 save
```
