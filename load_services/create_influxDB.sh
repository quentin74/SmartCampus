#! /bin/sh
CA_NAME=$1
CA_HOST=$2
CA_FILE_PATH=~/.ssh/ca/$3

wget https://s3.amazonaws.com/influxdb/influxdb_0.10.3-1_amd64.deb
sudo dpkg -i influxdb_0.10.3-1_amd64.deb
sudo cp influxdb.conf /etc/influxdb/

# Creation d'un certificat signé par la CA
sudo openssl req -new -nodes -keyout /etc/ssl/influxdb-key.pem -out influxdb-req.pem -days 3652
scp -i $CA_FILE_PATH influxdb-req.pem ${CA_NAME}@${CA_HOST}:~/
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} sudo openssl ca -out influxdb-crt.pem -infiles influxdb-req.pem
sudo scp -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST}:~/influxdb-crt.pem /etc/ssl/

ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/influxdb-crt.pem
ssh -i $CA_FILE_PATH ${CA_NAME}@${CA_HOST} rm -f ~/influxdb-req.pem

# Concaténation de la clef et le certificat
sudo cat /etc/ssl/influxdb-crt.pem /etc/ssl/influxdb-key.pem > /etc/ssl/influxdb.pem


sudo service influxdb restart
