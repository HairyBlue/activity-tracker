# Activity Tracker

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Purpose
This repo serve as my project on 'Software Engeenering 1' and continuation 'Software Engeenering 2' subject
Main purpose is to track activities on clubs and organization for schools

## Project Setup
```bash
./tagEnv.sh --production #OR --staging
./svc.sh build --notest # no unit test currently :_
./svc.sh start
```

```bash
./svc.sh --help
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

## Using with PM2 on linux
```bash
./tagPm2.sh start
```

## For more technical details. Read more about the infra setup
[Infra-Setup](z_doc_infra.txt)