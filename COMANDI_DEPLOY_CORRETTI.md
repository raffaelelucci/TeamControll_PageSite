# Comandi deploy corretti - Team Control Center

## 0. Ripara subito Nginx dopo i symlink rotti

Hai creato link in `sites-enabled` verso file che non esistono. Prima ripara così:

```bash
sudo rm -f /etc/nginx/sites-enabled/teamcontrolcenter-site
sudo rm -f /etc/nginx/sites-enabled/teamcontrolcenter-app
sudo rm -f /etc/nginx/sites-enabled/teamcontrolcenter-api
sudo nginx -t
sudo systemctl reload nginx
```

Il tuo errore `./site: No such file or directory` nasce perché sul server non avevi ancora caricato/estratto il pacchetto del sito.
Il tuo errore `/path/al/progetto/frontend` nasce perché era un placeholder, non un percorso reale.
Il tuo errore `npm: command not found` significa che Node/npm non sono installati sul server oppure devi usare Docker.

## 1. Carica il pacchetto sul server

Dal tuo PC:

```bash
scp teamcontrolcenter-saas-platform.zip deploy@vps-157f637e-vps-ovh-net:/home/deploy/
```

Sul server:

```bash
cd /home/deploy
unzip -o teamcontrolcenter-saas-platform.zip -d teamcontrolcenter-saas-platform
cd teamcontrolcenter-saas-platform
```

## 2. Avvio consigliato con Docker

```bash
cp .env.example .env
nano .env
sudo docker compose up -d --build
sudo docker ps
```

## 3. Installa le config Nginx dopo che i file esistono

```bash
cd /home/deploy/teamcontrolcenter-saas-platform
sudo cp nginx/teamcontrolcenter-site.conf /etc/nginx/sites-available/teamcontrolcenter-site
sudo cp nginx/teamcontrolcenter-app.conf /etc/nginx/sites-available/teamcontrolcenter-app
sudo cp nginx/teamcontrolcenter-api.conf /etc/nginx/sites-available/teamcontrolcenter-api

sudo ln -sfn /etc/nginx/sites-available/teamcontrolcenter-site /etc/nginx/sites-enabled/teamcontrolcenter-site
sudo ln -sfn /etc/nginx/sites-available/teamcontrolcenter-app /etc/nginx/sites-enabled/teamcontrolcenter-app
sudo ln -sfn /etc/nginx/sites-available/teamcontrolcenter-api /etc/nginx/sites-enabled/teamcontrolcenter-api

sudo nginx -t
sudo systemctl reload nginx
```

## 4. Certificati HTTPS

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d teamcontrolcenter.it -d www.teamcontrolcenter.it -d app.teamcontrolcenter.it -d api.teamcontrolcenter.it
```

## 5. Deploy statico alternativo senza Docker

Se vuoi solo pubblicare subito le pagine statiche SEO:

```bash
sudo mkdir -p /var/www/teamcontrolcenter-site/releases
sudo chown -R deploy:www-data /var/www/teamcontrolcenter-site
sudo chmod -R 775 /var/www/teamcontrolcenter-site

cd /home/deploy/teamcontrolcenter-saas-platform
TS=$(date +%Y%m%d_%H%M%S)
mkdir -p /var/www/teamcontrolcenter-site/releases/$TS
rsync -av --delete site/ /var/www/teamcontrolcenter-site/releases/$TS/
ln -sfn /var/www/teamcontrolcenter-site/releases/$TS /var/www/teamcontrolcenter-site/current
```

Poi usa un Nginx `root /var/www/teamcontrolcenter-site/current;` se non vuoi Docker.
