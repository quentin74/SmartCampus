#! /bin/sh
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH="${HOME}/.ssh/ca/$3"

# Ajout du package pour l'installation de mosquitto
sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
sudo apt-get update
sudo apt-get upgrade

# Installation de Mosquitto
sudo apt-get install openssl
sudo apt-get install mosquitto

sudo service mosquitto stop

sudo cp mosquitto.conf /etc/mosquitto/

# Creation d'un certificat signé par la CA
sudo mkdir /etc/mosquitto/certs
sudo mkdir /etc/mosquitto/ca_certificates

# Creation du fichier known_hosts
sudo touch ${HOME}/.ssh/known_hosts

sudo sh -c "ssh-keyscan -t rsa $CA_HOST > .ssh/known_hosts"

sudo openssl req -new -nodes -keyout /etc/mosquitto/certs/mosquitto-key.pem -out ./mosquitto-req.pem -days 3652
scp -i $CA_FILE_PATH mosquitto-req.pem ${CA_NAME}@${CA_HOST}:
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out mosquitto-crt.pem -infiles mosquitto-req.pem
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/mosquitto-crt.pem ~
sudo cp ~/mosquitto-crt.pem /etc/mosquitto/certs/

#ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} "rm -f ~/mosquitto-crt.pem"
#ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} "rm -f ~/mosquitto-req.pem"

# Récupération du ca du certificat.
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/demoCA/cacert.pem ~
sudo mv ~/cacert.pem /etc/mosquitto/ca_certificates

sudo service mosquitto start
