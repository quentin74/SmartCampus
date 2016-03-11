Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}
var path = Meteor.npmRequire('path');
var base = path.resolve('../../../../../server');
//var base = path.resolve('/bundle/bundle/programs/server/app/server');

var options = {
port: Meteor.settings.mqtt_options.port,
host: Meteor.settings.mqtt_options.host,
clientId: Meteor.settings.mqtt_options.clientId,
username: Meteor.settings.mqtt_options.username,
password: Meteor.settings.mqtt_options.password,
keepalive: Meteor.settings.mqtt_options.keepalive,
reconnectPeriod: Meteor.settings.mqtt_options.reconnectPeriod,
protocol: Meteor.settings.mqtt_options.protocol,
protocolVersion: Meteor.settings.mqtt_options.protocolVersion,
clean: Meteor.settings.mqtt_options.clean,
encoding: Meteor.settings.mqtt_options.encoding,
key : fs.readFileSync(path.resolve(base,Meteor.settings.mqtt_options.key)),
ca : fs.readFileSync(path.resolve(base,Meteor.settings.mqtt_options.ca)),
rejectUnauthorized: Meteor.settings.mqtt_options.rejectUnauthorized,
cert :fs.readFileSync(path.resolve(base,Meteor.settings.mqtt_options.cert)),
};
//console.log(options);
var mqttClient  = mqtt.connect(options);

mqttClient.on('connect',Meteor.bindEnvironment( function () {
  mqttClient.subscribe('rfxcom/sensor', {qos : Meteor.settings.mqtt_options.qos});
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
