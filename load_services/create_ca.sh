#! /bin/bash

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install openssl
sudo /usr/lib/ssl/misc/CA.sh -newca
