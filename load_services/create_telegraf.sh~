#! /bin/bash
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH=~/.ssh/ca/$3

wget http://get.influxdb.org/telegraf/telegraf_0.11.0-1_amd64.deb
sudo dpkg -i telegraf_0.11.0-1_amd64.deb
sudo cp telegraf /etc/init.d/
sudo cp mqtt_influxDB.conf /etc/telegraf/

# Creation d'un certificat signé par la CA
sudo openssl req -new -nodes -keyout /etc/telegraf/telegraf-key.pem -out telegraf-req.pem -days 3652
scp -i $CA_FILE_PATH telegraf-req.pem ${CA_NAME}@${CA_HOST}:~/
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out telegraf-crt.pem -infiles telegraf-req.pem
sudo scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/telegraf-crt.pem /etc/telegraf/

ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/telegraf-crt.pem
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/telegraf-req.pem

# Récupération du ca du certificat.
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:/usr/lib/ssl/misc/demoCA/cacert.pem /etc/telegraf/



sudo service telegraf restart 
