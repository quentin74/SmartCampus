#! /bin/bash
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH="${HOME}/.ssh/ca/$3"

sudo apt-get update
sudo apt-get upgrade

wget http://get.influxdb.org/telegraf/telegraf_0.11.0-1_amd64.deb
sudo dpkg -i telegraf_0.11.0-1_amd64.deb
sudo cp telegraf /etc/init.d/
sudo cp mqtt_influxDB.conf /etc/telegraf/

sudo chmod 755 /etc/init.d/telegraf

sudo update-rc.d telegraf default

# Creation d'un certificat signé par la CA

# Creation du fichier known_hosts
sudo touch ${HOME}/.ssh/known_hosts

sudo sh -c "ssh-keyscan -t rsa $CA_HOST > .ssh/known_hosts"

sudo openssl req -new -nodes -keyout /etc/telegraf/telegraf-key.pem -out telegraf-req.pem -days 3652
scp -i $CA_FILE_PATH telegraf-req.pem ${CA_NAME}@${CA_HOST}:
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out telegraf-crt.pem -infiles telegraf-req.pem
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/telegraf-crt.pem ~
sudo mv ~/telegraf-crt.pem /etc/telegraf/

ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} "rm -f ~/telegraf-crt.pem"
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} "rm -f ~/telegraf-req.pem"

# Récupération du ca du certificat.
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/demoCA/cacert.pem ~
sudo mv ~/cacert.pem /etc/telegraf


sudo service telegraf start 
