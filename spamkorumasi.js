const Discord = require("discord.js");
const db = require('quick.db');
var MessageData = [];
module.exports =async (client, msg, args) => {
  
  var kisi = msg.guild.member(msg.mentions.users.first())
  
  let botadı = client.user.username
  
   const i = await db.fetch(`spamengel_${msg.guild.id}`)
    if (i == "açık") { 
      
  if (msg.channel.name === undefined){
  }else{
  if (MessageData[msg.author.id] === undefined) {
    MessageData[msg.author.id] = { MesssageNumber: 0, LastMessage: [] };
    setTimeout(() => {
      delete MessageData[msg.author.id];
    }, 4000);
  }
  MessageData[msg.author.id].MesssageNumber += 1;

  MessageData[msg.author.id].LastMessage.push(msg);
if(msg.member.hasPermission("ADMINISTRATOR")) return;
    
  if (MessageData[msg.author.id].MesssageNumber >= 5) {
    if (msg.deletable) msg.delete();
      const sendeddd = new Discord.MessageEmbed()
        .setColor("#ff0004")
      .setAuthor(`${botadı}`, client.user.AvatarURL)
        .setDescription(msg.author.tag + " spam yapmayı kes yoksa susturulursun!");
      msg.channel.send(sendeddd).then(stopspam => {
        setTimeout(() => {
          stopspam.delete();
        }, 3000);
      });
    var isFine = false;
    MessageData[msg.author.id].LastMessage.forEach(msgg => {
      if (msg.channel.id == msgg.channel.id) {
        if (msg.content == msgg.content) {
          isFine = true;
        } else {
          isFine = false;
        }
      }
    });
    if (isFine) {
      //
      
        const spambed = new Discord.MessageEmbed()
          .setColor("#ff0004")
      .setAuthor(`${botadı}`, client.user.AvatarURL)
        .setDescription(msg.author.tag + " sana spam yapmayı kes yoksa susturulursun demiştim!");
        msg.channel.send(spambed);
        msg.channel.bulkDelete("5");
        msg.channel.overwritePermissions([
          {
             id: msg.author.id,
             deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
          },
        ]);
     
      }
    }
  if (MessageData[msg.author.id] >= 3) {
    if (msg.deletable) msg.delete();
     msg.channel.bulkDelete("6");
      const spambed = new Discord.MessageEmbed()
        .setColor("#ff0004") 
      .setAuthor(`${botadı}`, client.user.AvatarURL)
      .setDescription(msg.author.tag + " sana spam yapmayı kes yoksa susturulursun demiştim!");
      msg.channel.send(spambed);
      msg.channel.overwritePermissions(msg.author.id, {
                SEND_MESSAGES: false
});
    }
    ////burdan sonra ve aşağı sil :)
      if (MessageData[msg.author.id] >= 4) {
    if (msg.deletable) msg.delete();
     msg.channel.bulkDelete("7");
      const spambed = new Discord.MessageEmbed()
        .setColor("#ff0004") 
      .setAuthor(`${botadı}`, client.user.AvatarURL)
      .setDescription(msg.author.tag + " sana spam yapmayı kes yoksa susturulursun demiştim!");
      msg.channel.send(spambed);
      msg.channel.overwritePermissions(msg.author.id, {
                SEND_MESSAGES: false
});
    }
    
    ////

        if (MessageData[msg.author.id] >= 5) {
    if (msg.deletable) msg.delete();
     msg.channel.bulkDelete("8");
      const spambed = new Discord.MessageEmbed()
        .setColor("#ff0004") 
      .setAuthor(`${botadı}`, client.user.AvatarURL)
      .setDescription(msg.author.tag + " sana spam yapmayı kes yoksa susturulursun demiştim!");
      msg.channel.send(spambed);
      msg.channel.overwritePermissions(msg.author.id, {
                SEND_MESSAGES: false
})  
    }
    ////burayada :)
    
        ////

        if (MessageData[msg.author.id] >= 6) {
    if (msg.deletable) msg.delete();
     msg.channel.bulkDelete("9");
      const spambed = new Discord.MessageEmbed()
        .setColor("#ff0004") 
      .setAuthor(`${botadı}`, client.user.AvatarURL)
      .setDescription(msg.author.tag + " sana spam yapmayı kes yoksa susturulursun demiştim!");
      msg.channel.send(spambed);
      msg.channel.overwritePermissions(msg.author.id, {
                SEND_MESSAGES: false
})  
    }
    ////burayada :)
    
}
  }
};