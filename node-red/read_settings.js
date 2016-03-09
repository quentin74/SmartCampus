fs = require('fs');
path = '/home/pi/.node-red/';
encode = 'utf8';
flowFileName = 'flows_raspberrypi.json' ;
settingsFileName = 'settings.json' ;
credentialFileName = 'flows_raspberrypi_cred.json';

function changeSettings(flowFile,settingsFile,credFile){
 context = {};
 context.data = {};
 context.data.task1 = settingsFile;
 context.data.task2 = flowFile;
 context.data.task3 = credFile;

 if(context.data.task1 != null && context.data.task2 != null){
    var index,len,index_zwave_in,index_zwave_out = 0;
    var zwave_controller_exist = false;
    var re = /\/dev\/tty[a-z0-9]*/i;
    var re_unit = /units = \"[a-z]+\"/;
    var re_dur = /duration = [0-9]+/;  
    id_controller = "";
    msg2 = new Object();
    msg2.payload = context.data.task2;
    settings = context.data.task1;
    cred = context.data.task3;
    for (index = 0, len = msg2.payload.length; index < len; ++index){
	//console.log(msg2.payload[index]);
        switch(msg2.payload[index].type){
            case "rfxtrx-port": //if(settings.modem_rfxcom.serial_port != ""){
                                    msg2.payload[index].port= settings.modem_rfxcom.serial_port;
                                //}else{
                                //    msg2.payload.splice(index,1);
                                //}
                                break;
            case "mqtt-broker": msg2.payload[index].broker = settings.mqtt_broker.address; 
                                msg2.payload[index].port = settings.mqtt_broker.port;
                                msg2.payload[index].clientid = settings.mqtt_broker.clientid;
                                msg2.payload[index].usetls = typeof settings.mqtt_broker.usetls !== 'undefined' ? settings.mqtt_broker.usetls : false;
                                msg2.payload[index].verifyservercert = typeof settings.mqtt_broker.verifyservercert !== 'undefined' ? settings.mqtt_broker.verifyservercert : true;
                                
				if(cred.hasOwnProperty(msg2.payload[index].id)){
					cred[msg2.payload[index].id].user=settings.mqtt_broker.username;
					cred[msg2.payload[index].id].password=settings.mqtt_broker.password;
				}
				break;
            case "zwave-controller" :
                                     zwave_controller_exist = true;
                                     if(re.test(settings.modem_zwave.serial_port)){
                                         msg2.payload[index].port = settings.modem_zwave.serial_port;
                                         msg2.payload[index].driverattempts = typeof settings.modem_zwave.driverattempts !== 'undefined' ? settings.modem_zwave.driverattempts : "3";
                                         msg2.payload[index].pollinterval = typeof settings.modem_zwave.pollinterval !== 'undefined' ? settings.modem_zwave.pollinterval : "500";
                                         id_controller = msg2.payload[index].id;
                                     }else {
                                         msg2.payload.splice(index,1);
					 len = msg2.payload.length;
                                     }break;
            case "zwave-in":  index_zwave_in = index; 
                              msg2.payload[index].controller=id_controller;
                              break;
            case "zwave-out": index_zwave_out = index;
                              msg2.payload[index].controller=id_controller;
                             break;
            case "mqtt out": msg2.payload[index].topic = settings.mqtt_uplink.mqttTopic;
                             msg2.payload[index].qos = settings.mqtt_uplink.qos;
                             msg2.payload[index].retain = settings.mqtt_uplink.retain;
                             break;
            case "mqtt in":  msg2.payload[index].topic = settings.mqtt_downlink.mqttTopic;
                             break;
            case "function": 
			     if(msg2.payload[index].name === "trigger node"){    	
				duration = typeof settings.motion.duration !== 'undefined' ? settings.motion.duration : "10";
                             	unit = typeof settings.motion.unit !== 'undefined' ? settings.motion.unit : "min";				
				//console.log(msg2.payload[index].func);
				//console.log("units = \""+unit+"\"");
				//console.log("duration = "+duration);
				msg2.payload[index].func=msg2.payload[index].func.replace(re_unit,"units = \""+unit+"\"");
				msg2.payload[index].func=msg2.payload[index].func.replace(re_dur,"duration = "+duration);
				//console.log(msg2.payload[index].func);
			     }
                             break;
        }
    }
    if(!zwave_controller_exist && re.test(settings.modem_zwave.serial_port)){
        zwave_controller = new Object();
        id_controller = "af2a30fb.f3b978";
        zwave_controller.id = id_controller;
        zwave_controller.type = "zwave-controller";
        zwave_controller.z = "79568991.2ef1a";
        zwave_controller.port = settings.modem_zwave.serial_port;
        zwave_controller.driverattempts = typeof settings.modem_zwave.driverattempts !== 'undefined' ? settings.modem_zwave.driverattempts : "3";
        zwave_controller.pollinterval = typeof settings.modem_zwave.pollinterval !== 'undefined' ? settings.modem_zwave.pollinterval : "500";
        
        if(msg2.payload[index_zwave_in] !== 'undefined' && msg2.payload[index_zwave_in].hasOwnProperty('controller')){
            msg2.payload[index_zwave_in].controller = id_controller;
        }
        if(msg2.payload[index_zwave_out] !== 'undefined' && msg2.payload[index_zwave_out].hasOwnProperty('controller')){
            msg2.payload[index_zwave_out].controller = id_controller;
        }
        msg2.payload.splice(5,0,zwave_controller);
    }
    context.data = null;
    return {'newFlowFile':msg2.payload,'newCredFile':cred};
}else{ 
    return null;
}


}

//Open the files
try{
	var flowFileraw = fs.readFileSync(path+flowFileName,encode);
	var settingsFileraw = fs.readFileSync(path+settingsFileName,encode);
	var credFileraw = fs.readFileSync(path+credentialFileName,encode);
}catch(e){
	console.error("Read file fail");
 	console.error(e);
	throw e;
	console.error("-------------");
}

//Transform the JSON
try{
	var flowFile = JSON.parse(flowFileraw);
	var settingsFile = JSON.parse(settingsFileraw);
	var credFile = JSON.parse(credFileraw);
}catch(e){
	console.error("JSON parse failed");
	console.error(e);
	throw e;
	console.error("-------------");
}
//Change the flow file
var flows = changeSettings(flowFile,settingsFile,credFile);

//Write the new flow file
try{
	data = JSON.stringify(flows.newFlowFile);
	fs.writeFile(path+flowFileName, data,'utf8');
	data = JSON.stringify(flows.newCredFile);
	fs.writeFile(path+credentialFileName, data,'utf8');	

}catch(e){
 console.error(e);
 throw e;
}