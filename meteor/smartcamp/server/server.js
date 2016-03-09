Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	

var options = {
port: 8883,
host: 'YOUR_HOST_PUBLIC_IP',
clientId: 'GEST',
username: 'USERNAME',
password: 'PASSWORD',
keepalive: 60,
reconnectPeriod: 1000,
protocol: 'mqtts',
protocolVersion: 4,
clean: true,
encoding: 'utf8',
key : fs.readFileSync('server/client.key'),
ca : fs.readFileSync('server/ca.crt'),
rejectUnauthorized: false,
cert :fs.readFileSync('server/client.crt'),
};

var mqttClient  = mqtt.connect(options);

mqttClient.on('connect',Meteor.bindEnvironment( function () {
  mqttClient.subscribe('rfxcom/sensor', {qos :1});
  console.log('connecté');

}));

mqttClient.on('message', Meteor.bindEnvironment(function (topic, message) {
  console.log(message.toString());
  var myObject = JSON.parse(message.toString());
  Sensors.insert(myObject);
}));

});

Meteor.methods({
	"sendMail": function(options) {
		this.unblock();

		Email.send(options);
	}
});
