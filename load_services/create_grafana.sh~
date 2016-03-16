#! /bin/sh
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH=~/.ssh/ca/$3

wget https://grafanarel.s3.amazonaws.com/builds/grafana_2.6.0_amd64.deb
sudo dpkg -i grafana_2.6.0_amd64.deb
sudo cp grafana.ini /etc/grafana/

# Creation d'un certificat signé par la CA
sudo openssl req -new -nodes -keyout /etc/grafana/grafana-key.pem -out grafana-req.pem -days 3652
scp -i $CA_FILE_PATH grafana-req.pem ${CA_NAME}@${CA_HOST}:~/
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out grafana-crt.pem -infiles grafana-req.pem
sudo scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/grafana-crt.pem /etc/grafana/

ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/grafana-crt.pem
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/grafana-req.pem



sudo service grafana-server restart
