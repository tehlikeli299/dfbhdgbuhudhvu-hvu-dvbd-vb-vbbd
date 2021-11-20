const Discord = require('discord.js');
exports.run = (client, message, args) => {

 

  message.channel.send(`Bot Aktif`);
}
 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'test',
  description: 'Sohbetinizi kapatmaya yarar. Açmak için !!aç.',
  usage: 'kapat'
};