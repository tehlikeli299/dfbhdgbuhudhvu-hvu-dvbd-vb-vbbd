const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const ms = require("parse-ms");
const db = require("quick.db");
let talkedRecently = new Set();
module.exports = async message => {
  
  
  if (message.author.bot) return;

  if (talkedRecently.has(message.author.id)) {
    return;
  }
  talkedRecently.add(message.author.id);
  setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 2500);
  let client = message.client;
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || ayarlar.prefix;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0].slice(prefix.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;
 if (!client.commands.has(command)) {
    if (client.aliases.has(command)) {
      cmd = client.commands.get(client.aliases.get(command));
    } else {
      
          return message.channel.send(
      new Discord.MessageEmbed()
        .setColor(ayarlar.hata)
        .setDescription(`\`\`\`\Komutlarımda ${command} adında bir komut bulamadım!\nKomut listesine bakmak için: ${prefix}yardım\`\`\``)
        .setFooter(`${client.user.username}`)    
    ).then(kadir => kadir.delete({ timeout: 5000}))
      
    }
  }
  
  ////aga burda dur :)

  ////aga burda dur :)
  
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    
    ////////
    
    ///
    if (cmd.conf.enabled === false) {
      if (
        (!ayarlar.sahip.includes(message.author.id) &&
          !ayarlar.sahip2.includes(message.author.id),
        !ayarlar.sahip.includes(message.author.id) &&
          !ayarlar.sahip.includes(message.author.id))
      ) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `:x: **${cmd.help.name}** isimli komut şuanda geçici olarak kullanıma kapalıdır!`
          )
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 7000}));
        return;
      }
    }
    
      if (cmd.conf.bakim === false) {
      if (
        (!ayarlar.sahip.includes(message.author.id) &&
          !ayarlar.sahip2.includes(message.author.id),
        !ayarlar.sahip.includes(message.author.id) &&
          !ayarlar.sahip2.includes(message.author.id))
      ) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `:x: **${cmd.help.name}** isimli komut şuanda bakımdadır!`
          )
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 7000}));
        return;
      }
    }

    if (cmd.conf.permLevel === 1) {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `Bu komutu kullanabilmek için \`Mesajları Yönet\` iznine sahip olmalısın!`
          )
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 3000}));
        return;
      }
    }
    if (cmd.conf.permLevel === 2) {
      if (!message.member.hasPermission("KICK_MEMBERS")) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `Bu komutu kullanabilmek için \`Üyeleri At\` iznine sahip olmalısın!`
          )
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 3000}));
        return;
      }
    }
    if (cmd.conf.permLevel === 3) {
      if (!message.member.hasPermission("BAN_MEMBERS")) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `Bu komutu kullanabilmek için \`Üyeleri Yasakla\` iznine sahip olmalısın!`
          )
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 3000}));
        return;
      }
    }
    if (cmd.conf.permLevel === 4) {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            `Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!`
          )
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 3000}));
        return;
      }
    }
    if (cmd.conf.permLevel === 5) {
      if (!ayarlar.sahip.includes(message.author.id)) {
        if (!ayarlar.sahip.includes(message.author.id));
        const embed = new Discord.MessageEmbed()
          .setDescription(`Bu komutu sadece \`Sahibim\` kullanabilir!`)
          .setColor("BLACK");
        message.channel.send({ embed }).then(kadir => kadir.delete({ timeout: 3000}));
        return;
      }
    }
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
};
