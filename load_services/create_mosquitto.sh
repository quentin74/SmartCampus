#! /bin/sh
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH=~/.ssh/ca/$3


# Installation de Mosquitto
sudo apt-get install openssl
sudo apt-get install mosquitto
sudo cp mosquitto.conf /etc/mosquitto/

# Creation d'un certificat signé par la CA
sudo openssl req -new -nodes -keyout /etc/mosquitto/certs/mosquitto-key.pem -out mosquitto-req.pem -days 3652
scp -i $CA_FILE_PATH mosquitto-req.pem ${CA_NAME}@${CA_HOST}:~/
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out mosquitto-crt.pem -infiles mosquitto-req.pem
sudo scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/mosquitto-crt.pem /etc/mosquitto/certs/

ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/mosquitto-crt.pem
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/mosquitto-req.pem

# Récupération du ca du certificat.
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:/usr/lib/ssl/misc/demoCA/cacert.pem /etc/mosquitto/ca_certificates/

sudo service mosquitto restart
