#! /bin/sh
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH="${HOME}/.ssh/ca/$3"

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install openssl
wget https://grafanarel.s3.amazonaws.com/builds/grafana_2.6.0_amd64.deb
sudo dpkg -i grafana_2.6.0_amd64.deb
sudo apt-get -f install
sudo update-rc.d grafana-server defaults 95 10

sudo service grafana-server stop

sudo cp grafana.ini /etc/grafana/

# Creation d'un certificat signé par la CA

# Creation du fichier known_hosts
sudo touch ${HOME}/.ssh/known_hosts

sudo sh -c "ssh-keyscan -t rsa $CA_HOST > .ssh/known_hosts"

sudo openssl req -new -nodes -keyout /etc/grafana/grafana-key.pem -out grafana-req.pem -days 3652
scp -i $CA_FILE_PATH grafana-req.pem ${CA_NAME}@${CA_HOST}:
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out grafana-crt.pem -infiles grafana-req.pem
scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/grafana-crt.pem ~
sudo mv ~/grafana-crt.pem /etc/grafana/

ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} "rm -f ~/grafana-crt.pem"
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} "rm -f ~/grafana-req.pem"



sudo service grafana-server start
