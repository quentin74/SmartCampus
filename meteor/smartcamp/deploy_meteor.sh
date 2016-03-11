#! /bin/bash

HOST="52.11.255.78"

echo "===Compressing Files==="
zip -qr ../meteor.zip .
scp -i ~/.ssh/clefpub.pem  ../meteor.zip ubuntu@${HOST}:~
ssh -i ~/.ssh/clefpub.pem ubuntu@${HOST} 'sudo cp ~/meteor.zip /opt/smartcampus/'
echo "===Decompressing Files on server==="
ssh -i ~/.ssh/clefpub.pem ubuntu@${HOST} sudo unzip -qo /opt/smartcampus/meteor.zip -d /opt/smartcampus/current/
#ssh -i ~/.ssh/clefpub.pem ubuntu@${HOST} "cd /opt/smartcampus/current/ \ sudo meteor --settings settings.json -p 80"
echo "===Deploy Success==="
