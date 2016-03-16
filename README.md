# SmartCampus
Projet d'étude  RICM5
Ce projet a pour but d'aider les usager du campus en leurs apportant des informations sur les batiments. Pour ce projet nous utilisons meteor pour afficher des graphes et des informations sur des salles du campus de Polytech Grenoble.
* 

### Les Technologies

#### Materiel utilisé:
* Gateways
  *   Raspberry Pi 2 + Alimentation 5V DC
* ZWave
  * Clé USB Sigma ZWave
  * Détecteur de présence Aeon-labs ZWave

Détecteur d'ouverture Zipato ZWave
* Rfxcom
  * Récepteur RFXCom 443 MHz
  * Station WMR88
  * Sonde Oregon Hygro Baro
  * Sonde Oregon Luminosité
  * Sonde Oregon Thermo Hygro All Weather


#### Descriptif partie Applicatif

* Site web via meteor hebergé sur amazon
* Visualisation des données effectuée grace à Grafana et Leaflet
* faire le lien avec la bdd serveur
* Utilisation de meteor pour lier grafana et leaflet

### Partie Embarquée
* Node Red pour recuperer les données des capteurs Rfxcom et Zwave (ajout de noeud pour recuperation des données puis formatage pour l'envoi MQTT vers le serveur de base de données.
* Documentation sur cette technologie
* Test de connectivité et de transfert de paquet
* Assister à la réunion de Irock du Jeudi 05/02
* Serveur MQtt
* Sécurité des transmissions (SSL / LDAP / OpenVpn)

### Server

* mettre en place la bdd propre à Smart Campus (influxDB) qui sera liée à Grafana 
* L'id de chaque capteurs permettra de faire la distinction et nommera un capteur
* association id et clé privé (AES 128)
* Mise en place demqtt 
* serveur nodeJs (déjà en place?)



