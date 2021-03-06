#! /bin/sh

USER_GRAFANA_SERVER=ubuntu
PATH_PRIVATE_KEY_GRAFANA=${HOME}/.ssh/clefpub.pem
HOST_GRAFANA=54.200.85.205

USER_MOSQUITTO_SERVER=ubuntu
PATH_PRIVATE_KEY_MOSQUITTO=${HOME}/.ssh/clefpub.pem
HOST_MOSQUITTO=54.200.85.205

USER_INFLUXDB_SERVER=ubuntu
PATH_PRIVATE_KEY_INFLUXDB=${HOME}/.ssh/clefpub.pem
HOST_INFLUXDB=54.200.85.205

USER_TELEGRAF_SERVER=ubuntu
PATH_PRIVATE_KEY_TELEGRAF=${HOME}/.ssh/clefpub.pem
HOST_TELEGRAF=54.200.85.205

USER_CA_SERVER=ubuntu
PATH_PRIVATE_KEY_CA=${HOME}/.ssh/clefpub.pem
HOST_CA=54.200.85.205
CA_KEY_FILE=$(basename ${PATH_PRIVATE_KEY_CA})

echo $CA_KEY_FILE

# CA setup
echo 'CA setup on the server :' $HOST_CA
if [ -e ${PATH_PRIVATE_KEY_CA} ]
then
echo 'Path vers clef ok'
    SHORTCUT="-i $PATH_PRIVATE_KEY_CA"
echo $SHORTCUT
else
    SHORTCUT=""
fi

scp $SHORTCUT create_ca.sh ${USER_CA_SERVER}@${HOST_CA}:
ssh $SHORTCUT ${USER_CA_SERVER}@${HOST_CA} "./create_ca.sh"

# MOSQUITTO setup
echo 'Mosquitto setup on the server :' $HOST_MOSQUITTO
if [ -e ${PATH_PRIVATE_KEY_MOSQUITTO} ]
then
    SHORTCUT="-i $PATH_PRIVATE_KEY_MOSQUITTO"
else
    SHORTCUT=""
fi

# Envoi de la clef privée pour se connecter au CA
if [ -e ${PATH_PRIVATE_KEY_CA} ]
then
ssh $SHORTCUT ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO} 'mkdir -p ~/.ssh/ca'
scp $SHORTCUT $PATH_PRIVATE_KEY_CA ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO}:~/.ssh/ca
fi

scp $SHORTCUT create_mosquitto.sh ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO}:
scp $SHORTCUT mosquitto.conf ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO}:
ssh $SHORTCUT ${USER_MOSQUITTO_SERVER}@${HOST_MOSQUITTO} "./create_mosquitto.sh $USER_CA_SERVER $HOST_CA $CA_KEY_FILE"

# TELEGRAF setup
echo 'Telegraf setup on the server :' $HOST_TELEGRAF
if [ -e ${PATH_PRIVATE_KEY_TELEGRAF} ]
then
    SHORTCUT="-i $PATH_PRIVATE_KEY_TELEGRAF"
else
    SHORTCUT=""
fi

# Envoi de la clef privée pour se connecter au CA
if [ -e ${PATH_PRIVATE_KEY_CA} ]
then
ssh $SHORTCUT ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF} 'mkdir -p ~/.ssh/ca'
scp $SHORTCUT $PATH_PRIVATE_KEY_CA ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:~/.ssh/ca
fi

scp $SHORTCUT create_telegraf.sh ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:
scp $SHORTCUT mqtt_influxDB.conf ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:
scp $SHORTCUT telegraf ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF}:
ssh $SHORTCUT ${USER_TELEGRAF_SERVER}@${HOST_TELEGRAF} "./create_telegraf.sh $USER_CA_SERVER $HOST_CA $CA_KEY_FILE"

# INFLUXDB setup
echo 'InfluxDB setup on the server :' $HOST_INFLUXDB
if [ -e ${PATH_PRIVATE_KEY_INFLUXDB} ]
then
    SHORTCUT="-i $PATH_PRIVATE_KEY_INFLUXDB"
else
    SHORTCUT=""
fi

# Envoi de la clef privée pour se connecter au CA
if [ -e ${PATH_PRIVATE_KEY_CA} ]
then
ssh $SHORTCUT ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB} 'mkdir -p ~/.ssh/ca'
scp $SHORTCUT $PATH_PRIVATE_KEY_CA ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB}:~/.ssh/ca
fi

scp $SHORTCUT create_influxDB.sh ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB}:
scp $SHORTCUT influxdb.conf ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB}:
ssh $SHORTCUT ${USER_INFLUXDB_SERVER}@${HOST_INFLUXDB} "./create_influxDB.sh $USER_CA_SERVER $HOST_CA $CA_KEY_FILE"

# GRAFANA setup
echo 'Grafana setup on the server :' $HOST_GRAFANA
if [ -e ${PATH_PRIVATE_KEY_GRAFANA} ]
then
    SHORTCUT="-i $PATH_PRIVATE_KEY_GRAFANA"
else
    SHORTCUT=""
fi

# Envoi de la clef privée pour se connecter au CA
if [ -e ${PATH_PRIVATE_KEY_CA} ]
then
ssh $SHORTCUT ${USER_GRAFANA_SERVER}@${HOST_GRAFANA} 'mkdir -p ~/.ssh/ca'
scp $SHORTCUT $PATH_PRIVATE_KEY_CA ${USER_GRAFANA_SERVER}@${HOST_GRAFANA}:~/.ssh/ca
fi

scp $SHORTCUT create_grafana.sh ${USER_GRAFANA_SERVER}@${HOST_GRAFANA}:
scp $SHORTCUT grafana.ini ${USER_GRAFANA_SERVER}@${HOST_GRAFANA}:~/
ssh $SHORTCUT ${USER_GRAFANA_SERVER}@${HOST_GRAFANA} "./create_grafana.sh $USER_CA_SERVER $HOST_CA $CA_KEY_FILE"
