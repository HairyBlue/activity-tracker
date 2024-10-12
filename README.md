# Activity Tracker

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Purpose
This repo serve as my project on 'Software Engeenering 1' and continuation 'Software Engeenering 2' subject
Main purpose is to track activities on clubs and organization for schools

## Project Setup
```bash
./svc.sh --help
```

```bash
./svc.sh build --notest
./svc.sh start
```

## Electron setup
```bash
./svc.sh electron --build #or if already build just "electron"
# repeate project setup
```

## Using with PM2 and PM2 Windows Service
[reference for the pm2 setup](https://profoundlogicsupport.atlassian.net/wiki/spaces/PUI/pages/164514058/Autostart+Profoundjs+with+PM2#Installing-PM2)
### Usage
```bash
cd server
pm2 start pm2.config.js
pm2 save
```

## For more info and technical details. Visit [Docs](docs)