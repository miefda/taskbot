var irc = require("irc"),
	exec = require('child_process').execFile,
	parse = require('shell-quote').parse;

var config = {
  userName : "task",
  realName : "task",
  channels : ['#retiolum', '#testing'],
  server : "10.243.231.66",
  botName : "task",
	flood : true,
	floodDelay : 1000,	
	banCMD : [
	"execute", "show", "edit", "config"
	]
	};

function isBanned(cmd){
	for (var x in config.banCMD){
		if (config.banCMD[x].indexOf(cmd) !== -1){
			return true;
		}
	}
	return false;
}

var bot = new irc.Client(config.server, config.botName, {
  userName: config.userName,
  realName: config.realName,
  channels: config.channels,
  floodProtectionDelay: config.floodDelay,  
  floodProtection: config.flood,
});

function tw(command, from){
  ding = exec("task", command, {timeout: 1000}, function (error, stdout, stderr) {
		console.log("response: ", from, stdout)
		bot.say(from, stdout);
  });
};


bot.addListener("message", function(from, to, text3, message) {
  text = parse(text3);
  for (var i=0;i<text.length;i++){
  if (typeof text[i]=== typeof {}){
    text[i] = "";
  }
  }
  if (text[0] === config.botName + ":") {
		console.log("recieved: ", from, to, text3);
  if ("help".indexOf(text[1]) !== -1 ) {
    try {
      text.shift();
      tw(text, from);
    } catch(err){
			console.log(err);
      return bot.say(from , err.toString())
		}
	}else if (isBanned(text[1])){
			console.log("response:  nope!")
			return bot.say(to, "nope!");
    }else {
    try {
      text.shift();
      tw(text, to);
    } catch(err){
			console.log(err);
      return bot.say(from , err.toString())
    }}
  }
  
  
});

module.exports = {
  bot: bot,
}
