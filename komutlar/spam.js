const Discord = require('discord.js')
const db = require('quick.db')

exports.run = async (client ,message, args) => {
  
if(args[0] === 'aç') {
  
    let spamengel = await db.fetch(`spamengel_${message.guild.id}`)
    
     if (spamengel) {
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("HATA!")
        .setDescription("Görünüşe göre spam koruma zaten Aktif!");

      message.channel.send(embed);
      return;
    } 
  
    db.set(`spamengel_${message.guild.id}`, "açık")
    message.channel.send(`${message.author}, Spam Koruma Başarılı Şekilde \`Açıldı!\``)
  return
}
if (args[0] === 'kapat') {  
  db.delete(`spamengel_${message.guild.id}`)
message.channel.send('Spam Koruma Başarılı Şekilde `Kapatıldı!`')
return
}
  message.reply('Spam Korumasını Açmak İçin **Aç** Yada **Kapat** Yazmalısın!')
};
exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ['spam'],
 permLevel: 0
};

exports.help = {
 name: 'spam-ayarla',
 description: 'Spam Yapanları Susturur',
 usage: 'spam'
};