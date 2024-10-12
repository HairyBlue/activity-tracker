### SETUP SSH
```bash
sudo apt install openssh-server #if not yet installed
sudo systemctl enable ssh
```

### SETUP SERVER
```bash
sudo apt update
sudo apt install curl unzip git apache2
```

### for production and staging environment
```bash
mkdir staging-environment
mkdir production-environment
```

### node setup and project
#### USING NODE V20.17.0
#### install node from site https://nodejs.org/en/download/package-manager
#### using fnm 
```bash
fnm use --install-if-missing 20
fnm default 20

npm install pm2 -g

# cd staging-environment && production-environment (do git clone)
git clone git@bitbucket.org:hairyblue1/activity-tracker.git 

# cd ~
git clone git@bitbucket.org:hairyblue1/dssc.git 
sudo cp dssc/production/* production-environment/
sudo cp dssc/staging/* staging-environment/
```

### add permission
```bash
sudo chmod 755 -R /home/<user>
sudo chmod 755 -R /home/<user>

sudo chmod 755 -R /home/<user>/production-environment
sudo chmod 755 -R /home/<user>/staging-environment

# specify if neaded each project
# sudo chmod 755 -R /home/<user>/production-environment/activity-tracker
# sudo chmod 755 -R /home/<user>/staging-environment/activity-tracker

sudo chmod 600 ~/.ssh/id_rsa
sudo chmod 600 ~/.ssh/id_rsa.pub
```



### mysql setup
```bash
sudo apt list | grep "mysql"
sudo apt install mysql-client mysql-server

sudo mysql -u root -p 
```
``` sql
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
# ALTER USER 'username'@'localhost' IDENTIFIED BY 'password';
# CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# GRANT PRIVILEGE ON database.table TO 'username'@'host';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD, PROCESS, LOCK TABLES  on *.* TO 'username'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit

CREATE DATABASE activity_tracker;
CREATE DATABASE activity_tracker_dev;
```



### apache2 setup 
``` bash
sudo apache2ctl configtest
ls /etc/apache2/sites-enabled/
sudo a2ensite 000-default.conf # if not listed
sudo apache2ctl -M

#enable proxy and proxy_http
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
# sudo a2enmod rewrite

#disable proxy and proxy_http
sudo a2dismod proxy
sudo a2dismod proxy_http
sudo a2disnmod headers
# sudo a2dismod rewrite

sudo tail -f /var/log/apache2/error.log

# create own conf
# cd /etc/apache2/sites-available/
# sudo nano activity_tracker.conf
# sudo a2ensite activity_tracker.conf
# sudo a2dissite activity_tracker.conf # to disable

sudo systemctl restart apache2
#######################################################################################
<VirtualHost *:80>
    ServerAdmin nickimartypecision@g.cjc.edu.ph

    # Error documents
    ErrorDocument 403 /403.html
    ErrorDocument 404 /404.html
    ErrorDocument 503 /503.html

    DocumentRoot /home/<user>/production-environment
    <Directory /home/<user>/production-environment>
        Options -Indexes +FollowSymLinks 
        AllowOverride None
        Require all granted
        # Require all denied
        
        Header set Team "Dummy Batch"
        Header set Authors "Hairyblue, Alcatraz"
        Header set Department "CCIS"
    </Directory>

    Alias "/staging" "/home/<user>/staging-environment"
    <Directory /home/<user>/staging-environment>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
        # Require all denied

        Header set Team "Dummy Batch"
        Header set Authors "Hairyblue, Alcatraz"
        Header set Department "CCIS"
    </Directory>

    <Directory /home/<user>/staging-environment/activity-tracker>
        Require all denied
    </Directory>

 
    # Activity Tracker - NODE APP 
    <Location /activity-tracker>
        ProxyPass "http://localhost:3500"
        ProxyPassReverse "http://localhost:3500"

        Header set Team "Dummy Batch"
        Header set Authors "Hairyblue"
        Header set Department "CCIS"

        # Uncomment if CORS is needed
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        Header set Access-Control-Allow-Headers "X-Requested-With, content-type, Team, Author, Department"

        # Allow access to proxied resources
        Require all granted
    </Location>

    <Location /staging-activity-tracker>
        ProxyPass "http://localhost:3501"
        ProxyPassReverse "http://localhost:3501"

        Header set Team "Dummy Batch"
        Header set Authors "Hairyblue"
        Header set Department "CCIS"

        # Uncomment if CORS is needed
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        Header set Access-Control-Allow-Headers "X-Requested-With, content-type, Team, Author, Department"

        # Allow access to proxied resources
        Require all granted
    </Location>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
#######################################################################################
```


### server setup
```bash
## Make a backup if there an existing setup and need to be rebuild
./scripts/backup.sh attachments
./scripts/backup.sh database

## change neccessary details for .env
./svc.sh build --notest --staging
./svc.sh build --notest --production
./svc.sh build --test --staging
./svc.sh build --test --production

## DB
./svc.sh database --migrate
./svc.sh database --reset (optional) -- not working on dev environment | --webmaster-only
./svc.sh database --dummy (optional) -- not working on dev environment | --webmaster-only

## Restore backups if neccessary
./scripts/restore.sh attachments
./scripts/restore.sh database

## START SERVICES
./svc.sh start

## PM2
./svc.sh pm2 --start
./svc.sh pm2 --stop
---------------------------------------------------------------------------------------------------
```

### PM2 setup 
``` bash
-- setup pm2 startup
pm2 startup
-- copy the provided script

-- USING FNM as node version manager
-- locate fnm bin node
which fnm 
-- sample --> /home/<user>/.local/share/fnm/node-versions/<version>/installation/bin/node
-- add to .env OR z_env_config --> PM2_INTERPRETER=/home/<user>/.local/share/fnm/node-versions/<version>/installation/bin/node
----------------------------------------------------------------------------------------------------
```

### Enabling Firewall
``` bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http # OR sudo ufw allow 80
sudo ufw allow https # OR sudo ufw allow 443
sudo ufw allow 'Apache Full'
```

### PRESERVER HOST HEADER APACHE 
``` bash
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod remoteip 

ProxyPreserveHost On

<Location />
RequestHeader set X-Real-IP %{REMOTE_ADDR}e
RequestHeader append X-Forwarded-For %{REMOTE_ADDR}e
RequestHeader set X-Forwarded-Proto expr=%{REQUEST_SCHEME}
# RemoteIPHeader X-Forwarded-For
# RemoteIPInternalProxy your_proxy_ip
</Location>
```

### NGIX SAMPLE
```bash
# Define an upstream group if you have multiple backend servers
# upstream backend {
#     server 192.168.1.10;
#     server 192.168.1.11;
# }

server {
    listen 80;
    server_name example.com www.example.com;

    # Optional: Redirect HTTP to HTTPS
    # return 301 https://$host$request_uri;

    location / {
        # If using an upstream group:
        # proxy_pass http://backend;

        # Single backend server
        proxy_pass http://your_backend_server_ip;

        # Preserve Host header
        proxy_set_header Host $host;

        # Forward the client’s IP address
        proxy_set_header X-Real-IP $remote_addr;

        # Forward the original X-Forwarded-For header
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Forward the original protocol (HTTP or HTTPS)
        proxy_set_header X-Forwarded-Proto $scheme;

        # Disable proxy redirects
        proxy_redirect off;

        # Optional: Timeout settings
        # proxy_connect_timeout 60s;
        # proxy_read_timeout 60s;
        # proxy_send_timeout 60s;

        # Optional: Buffer settings
        # proxy_buffering on;
        # proxy_buffers 16 32k;
        # proxy_buffer_size 64k;
    }

    # Optional: Serve static files directly
    # location /static/ {
    #     alias /path/to/static/files/;
    # }
}

# HTTPS server block
# server {
#     listen 443 ssl;
#     server_name example.com www.example.com;

#     ssl_certificate /path/to/cert.pem;
#     ssl_certificate_key /path/to/key.pem;

#     location / {
#         proxy_pass http://your_backend_server_ip;
#         # ... other proxy settings ...
#     }
# }
```