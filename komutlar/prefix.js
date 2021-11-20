const Discord = require("discord.js");
const db = require("quick.db");
exports.run = async (client, message, args) => {

  if (!message.member.hasPermission("ADMINISTRATOR"))
  return message.channelchannel.send(
        new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setDescription(
            ` •\`${prefix}prefix-ayarla\`Kullanabilmek için , \`Yönetici\` **Yetkisine sahip olmanız gerekir**.`
        ));
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || "!!";
{
  let prefix = args.slice(0).join(" ");
    
        if (!prefix) {
          const valiant = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .setDescription(`**__Prefix Giriniz__**`)
            .setFooter(client.user.username, client.user.avatarURL());
          message.channel.send(valiant);
          return;
        }
        const valiant = new Discord.MessageEmbed()
          .setColor("ORANGE")
          .setDescription(`__Prefix__: \`${prefix}\` Olarak Ayarlandı`)
          .setFooter(client.user.username, client.user.avatarURL());
        message.channel.send(valiant);
        db.set(`prefix_${message.guild.id}`, prefix);
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["prefix-ayarla"],
  permLevel: 0

};
exports.help = {
  name: "prefix",
  description: "prefix",
  usage: "prefix"
};