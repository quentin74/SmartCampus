#! /bin/bash

HOST="52.11.255.78"

echo "===Compressing Files==="
zip -qr ../meteor.zip . -x deploy_meteor.sh
scp -i ~/.ssh/clefpub.pem  ../meteor.zip ubuntu@${HOST}:~
ssh -i ~/.ssh/clefpub.pem ubuntu@${HOST} 'sudo cp ~/meteor.zip /opt/smartcampus/'
echo "===Decompressing Files on server==="
ssh -i ~/.ssh/clefpub.pem ubuntu@${HOST} sudo unzip -qo /opt/smartcampus/meteor.zip -d /opt/smartcampus/current/
ssh -i ~/.ssh/clefpub.pem ubuntu@${HOST} "sudo service meteor restart"
echo "===Deploy Success==="
