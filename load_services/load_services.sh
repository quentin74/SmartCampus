#! /bin/sh

USER_GRAFANA_SERVER=ubuntu
PATH_PRIVATE_KEY_GRAFANA=${HOME}/.ssh/clefpub.pem
HOST_GRAFANA=52.11.255.78

USER_MOSQUITTO_SERVER=ubuntu
PATH_PRIVATE_KEY_MOSQUITTO=${HOME}/.ssh/clefpub.pem
HOST_MOSQUITTO=52.11.255.78

USER_INFLUXDB_SERVER=ubuntu
PATH_PRIVATE_KEY_INFLUXDB=${HOME}/.ssh/clefpub.pem
HOST_INFLUXDB=52.11.255.78

USER_TELEGRAF_SERVER=ubuntu
PATH_PRIVATE_KEY_TELEGRAF=${HOME}/.ssh/clefpub.pem
HOST_TELEGRAF=52.11.255.78

USER_CA_SERVER=ubuntu
PATH_PRIVATE_KEY_CA=${HOME}/.ssh/clefpub.pem
HOST_CA=52.11.255.78


# CA setup
echo 'CA setup on the server :' $HOST_CA
if [ -e ${PATH_PRIVATE_KEY_CA} ]
then
    SHORTCUT=-i $PATH_PRIVATE_KEY_CA
else
    SHORTCUT=""
fi

scp $SHORTCUT create_ca.sh ${USER_CA_SERVER}@${HOST_CA}:~/
ssh $SHORTCUT ${USER_CA_SERVER}@${HOST_CA} ~/create_ca.sh

# MOSQUITTO setup
echo 'Mosquitto setup on the server :' $HOST_MOSQUITTO
if [ -e ${PATH_PRIVATE_KEY_MOSQUITTO} ]
then
    SHORTCUT=-i $PATH_PRIVATE_KEY_MOSQUITTO
else
    SHORTCUT=""
fi
scp $SHORTCUT create_mosquitto.sh ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO}:~/
scp $SHORTCUT mosquitto.conf ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO}:~/
ssh $SHORTCUT ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO} ~/create_mosquitto.sh

# TELEGRAF setup
echo 'Telegraf setup on the server :' $HOST_TELEGRAF
if [ -e ${PATH_PRIVATE_KEY_TELEGRAF} ]
then
    SHORTCUT=-i $PATH_PRIVATE_KEY_TELEGRAF
else
    SHORTCUT=""
fi
scp $SHORTCUT create_telegraf.sh ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:~/
scp $SHORTCUT mqtt_influxDB.conf ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:~/
scp $SHORTCUT telegraf ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:~/
ssh $SHORTCUT ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF} ~/create_telegraf.sh

# INFLUXDB setup
echo 'InfluxDB setup on the server :' $HOST_INFLUXDB
if [ -e ${PATH_PRIVATE_KEY_INFLUXDB} ]
then
    SHORTCUT=-i $PATH_PRIVATE_KEY_INFLUXDB
else
    SHORTCUT=""
fi
scp $SHORTCUT create_influxDB.sh ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB}:~/
scp $SHORTCUT influxdb.conf ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB}:~/
ssh $SHORTCUT ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB} ~/create_influxDB.sh

# GRAFANA setup
echo 'Grafana setup on the server :' $HOST_GRAFANA
if [ -e ${PATH_PRIVATE_KEY_GRAFANA} ]
then
    SHORTCUT=-i $PATH_PRIVATE_KEY_GRAFANA
else
    SHORTCUT=""
fi
scp $SHORTCUT create_grafana.sh ${USER_GRAFANA_SERVER}@${HOST_GRAFANA}:~/
scp $SHORTCUT grafana.ini ${USER_GRAFANA_SERVER}@${HOST_GRAFANA}:~/
ssh $SHORTCUT ${USER_GRAFANA_SERVER}@${HOST_GRAFANA} ~/create_grafana.sh
