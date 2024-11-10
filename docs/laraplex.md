## Update APT LIST
```bash
sudo apt update
```

## Installation
###
``` bash
sudo apt install curl unzip git apache2
```

### PHP
```bash
sudo apt install php libapache2-mod-php php-cli php-xml php-zip
```

### MYSQL
```bash
sudo apt list | grep "mysql"
sudo apt install mysql-client mysql-server

sudo mysql -u root -p

CREATE DATABASE laravel;

CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
# ALTER USER 'username'@'localhost' IDENTIFIED BY 'password';
# CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# GRANT PRIVILEGE ON database.table TO 'username'@'host';
# GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD, PROCESS, LOCK TABLES  on *.* TO 'username'@'localhost' WITH GRANT OPTION;
# GRANT ALL PRIVILEGES ON *.* TO 'sammy'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON `laravel`.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
exit
```

### Composer
#### if there latest, https://getcomposer.org/download/
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```

### Node
#### if there latest (linux/fnm), https://nodejs.org/en/download/package-manager  
```bash
# installs fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash
# activate fnm
source ~/.bashrc
# download and install Node.js
fnm use --install-if-missing 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.18.0`
# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```

### PHP --ini
```bash
# uncomment mysqli and pdo_mysql
# commnet on cli php ini
sudo nano /etc/php/8.x/apache2/php.ini
```

### Build Setup
```bash
composer install --ignore-platform-reqs
npm run install
cp .env.example .env
php artisan key:generate
```

<hr>
<hr>

### ENV
```bash
-- additional ---
APP_URL=http://192.168.8.163/laraplex
ASSET_URL=http://192.168.8.163/laraplex
LIVEWIRE_ASSET_URL=http://192.168.8.163/laraplex/vendor/livewire/livewire.js
```

### Publish static files
```bash
# https://laravel-livewire.com/docs/2.x/installation
php artisan vendor:publish --force --tag=livewire:assets
php artisan filament:asset
```

### Config changes
```bash
# Liverwire config/liverwire.php
'asset_url' => env('LIVEWIRE_ASSET_URL', 'http://localhost'),

# filament config/filament.php
'asset_url' => env('ASSET_URL', 'http://localhost'),
```

### Routes/Web.php changes
``` bash
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Livewire\Livewire;


//Livewire::setScriptRoute(function ($handle) {
//    return Route::get('/laraplex/vendor/livewire/livewire.js', $handle);
//});

Livewire::setUpdateRoute(function ($handle) {
    return Route::post('/laraplex/livewire/update', $handle);
});

// Optionally, set the script route if you want to change the default script route

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/login', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');

// Handle login
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');

```

### .htaccess
```bash
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    RewriteBase /laraplex/
    # RewriteRule ^(.*)$ public/$1 [L]
    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### Apache2 Config
``` bash
        # ProxyPassReverse /laraplex http://127.0.0.1:8000

        Alias /laraplex /home/<user>/Laraplex/public

        # Allow Override for .htaccess (necessary for Laravel)
        <Directory /home/<user>/Laraplex/public>
                Options Indexes MultiViews FollowSymLinks
                AllowOverride All
                Require all granted
        </Directory>
```

### Clearing Cache
```bash
# dont know just following the internet, nothings broke btw
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Ownership/permission restriction
```bash
sudo chmod 775 -R /home/<user>/Laraplex

sudo chmod 775 -R storage
```

### For Auth page bg image
```css
background-image: url("{{env('APP_URL') . '/images/norbert_bg.jpg'}}");
```