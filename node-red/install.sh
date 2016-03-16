#! /bin/bash
VERSION="1.4"

sudo apt-get update
sudo apt-get upgrade
sudo systemctl enable nodered.service

if [ ! -e ./node_archive_armhf.deb ] 
then
	echo "===Mise à jour du NodeJs==="
	sudo apt-get remove nodered
	sudo apt-get remove nodejs nodejs-legacy
	sudo apt-get remove npm
	wget http://node-arm.herokuapp.com/node_archive_armhf.deb
	sudo dpkg -i node_archive_armhf.deb
	sudo apt-get install build-essential python-dev python-rpi.gpio
	sudo npm cache clean
	sudo npm install -g --unsafe-perm  node-red
fi

echo "===Configuration du démarrage de Node-Red au boot==="
sudo wget https://raw.githubusercontent.com/quentin74/Smartcampus/master/node-red/nodered.service -O /lib/systemd/system/nodered.service
sudo wget https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/node-red-start -O /usr/bin/node-red-start
sudo wget https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/node-red-stop -O /usr/bin/node-red-stop
sudo chmod +x /usr/bin/node-red-st*

if [ ! -e ./v${VERSION}.zip ]
then
	echo "===Installation de OpenZwave==="
	wget https://github.com/OpenZWave/open-zwave/archive/v${VERSION}.zip
	unzip v${VERSION}.zip
	cd open-zwave-${VERSION}
	sudo apt-get install libudev-dev 
	make
	sudo make install
	sudo cp /usr/local/lib/libopenzwave.so* /usr/lib/
fi

if [ ! -d ~/.node-red/node_modules/node-red-contrib-rfxcom ]
then
	echo "===Installation des noeuds==="
	mkdir ~/.node-red
	cd ~/.node-red/
	npm install node-red-contrib-rfxcom
	npm install node-red-contrib-openzwave
fi

if [ ! -d ~/Smartcampus ]
then
	echo "===Recuperation du git==="
	cd ~/
	git clone https://github.com/quentin74/Smartcampus.git
	cp ~/Smartcampus/node-red/flows_* ~/.node-red/
	cp ~/Smartcampus/node-red/getSerialId.py ~/.node-red/
	cp ~/Smartcampus/node-red/nodered_restart ~/.node-red/
	cp ~/Smartcampus/node-red/read_settings.js ~/.node-red/
	cp ~/Smartcampus/node-red/settings.json ~/.node-red/
	cp -r ~/Smartcampus/node-red/node-red-contrib-enocean ~/.node-red/node_modules/
fi

sudo systemctl daemon-reload
~/.node-red/nodered_restart
