#! /bin/sh

wget https://grafanarel.s3.amazonaws.com/builds/grafana_2.6.0_amd64.deb
sudo dpkg -i grafana_2.6.0_amd64.deb
sudo cp grafana.ini /etc/grafana/
sudo service grafana-server restart
