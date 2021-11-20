//-------------- TANIMLAMALAR --------------
const Discord = require('discord.js')
const client = new Discord.Client({disableMentions:"everyone",ws: { intents: new Discord.Intents(Discord.Intents.ALL) }})
const db = require("quick.db")
const ayarlar = require("./ayarlar.json");

    databaseName:"ekData"
    databaseFolder:"veriler"
    adapter:"YamlDB"

const chalk = require("chalk");
const fs = require("fs")
const moment = require("moment");
require("moment-duration-format");



//----------- AYARLAMALAR ------------
client.ayarlar = {
	token: "ODI2NTAzMzYzMzQ4MTM1OTc4.YGNbPQ.IF1woUITAB5eBXZGzPt1qbknEt4",
	gelistirici:["700462082839281776"],
	oauthSecret: "mEJNtFrvF3cJDkooWWZIzrNagLd6Rgdy",
	callbackURL: "https://dj-odsgh.glitch.me/callback",
    id:"826503363348135978",
  prefix: "-",
}

var prefix = ayarlar.prefix

let komutum = JSON.parse(fs.readFileSync("./komutlar.json", "utf8"));

client.cmdd = komutum

client.commands = new Discord.Collection()

const log = message => {
  console.log(`${message}`);
};

var deasync = require('deasync');

function userBul(ID) {
  return deasync(async(_ID, cb) => {
    let output = null;

    try {
      let user = await client.users.fetch(_ID);

      output = { 
        tag: user.tag,
        id: user.id,
        avatar: user.avatarURL({dyncamic: true}),
        name:user.username,
        isbot:user.bot,
     };
    } catch(err) { output = {tag:"Bulunamadı#0000",isbot:null,name:"Bulunamadı",avatar:client.user.avatarURL({dyncamic: true})} }
    
    cb(null, output);
  })(ID);
}

 function kisalt(str) {
  var newstr = "";
  var koyulan = 0;
  if(str.length > 10) {
    dongu: for(var i = 0;i<str.length;i++) {
      const element = str.split("")[i];
      if(i >= 28) { 
        if(koyulan < 3) {
          newstr += " .";
          koyulan++;
        }else {
          break dongu;
        }
        
      }else newstr += element; 
    }
    return newstr;
  }else return str;
}

const zaman = moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniye]");

function botista() {
	return {
		serverSize: client.guilds.cache.size,
		userSize:client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
		emojiSize:client.emojis.cache.size.toLocaleString(),
		channelSize:client.channels.cache.size.toLocaleString(),
		uptime:moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniye]")
	}
}
client.db = db
client.stats = botista
client.kisibul = userBul
client.tools = {
	kisalt:kisalt
}
client.on("ready", async() => require("./dash")(client))


///////////////////7////

client.on("message",async  message => {

  if (!message.guild) return;
  
let prefix = await db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix;

  if(message.content.startsWith(prefix)) {
        let komutum = client.cmdd
        if(komutum[message.guild.id]) {
            for (var i = 0; i < Object.keys(komutum[message.guild.id]).length; i++) {
                if(message.content.slice(prefix.length) === Object.keys(komutum[message.guild.id][i])[0]) {
                   
                    message.channel.send(komutum[message.guild.id][i][Object.keys(komutum[message.guild.id][i])])
                  
                    return
                }
            }
        }
    }
});
////////////////////////


////////////////////////
client.on("message", async msg => {
 
 //let k = db.fetch(`üyelikk_${msg.author.id}`);
 
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
    if (i == 'acik') {
      if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm' || msg.content.toLowerCase() == 'sea'|| msg.content.toLowerCase() == 'selam') {
          try {
            if (db.has(`üyelikk_${msg.author.id}`)) {
             msg.channel.send(
             new Discord.MessageEmbed()
              .setColor("GOLD") 
             .setDescription(`  
             <a:wooow:846800051685818418> ${msg.author}, Aleyküm Selam, Hoşgeldin! **GOLD ÜYE** <a:wooow:846800051685818418>
             `)
               )
            } else
                  return msg.reply(
                    'Aleyküm Selam, Hoşgeldin!')
            
          } catch(err) {
            console.log(err);
          }
      }
    }
    else if (i == 'kapali') {
   
    }
    if (!i) return;
 
    });
////////////////////////
const AntiSpam = require("./spamkorumasi.js");
const cooldown = new Set();

client.on("message", msg => {
  if (client.user.id == msg.author.id) return;
  AntiSpam(client, msg);
  if (cooldown.has(msg.author.id)) {
    return;
  }
})
///////////////

client.on("message", async message => {  
  if (message.author.bot) return;
   let yazılar = db.fetch(`${message.guild.id}.otocevap.yazılar`)
   let cevaplar = db.fetch(`${message.guild.id}.otocevap.cevaplar`)
  var kadir = ""
  let user = message.author
  let tag = message.author.tag
  let kurucu = message.guild.owner
  let kanal = message.channel.name
  let sunucuadı = message.guild.name
  let üyesayı = message.guild.members.cache.size
      for (var i = 0; i < (db.fetch(`${message.guild.id}.otocevap.yazılar`) ? db.fetch(`${message.guild.id}.otocevap.yazılar`).length : 0); i++) {
    if (message.content.toLowerCase() == yazılar[i].toLowerCase()) {
        kadir += `${cevaplar[i].replace("{sunucuadı}", `${sunucuadı}`).replace("{üyesayı}", `${üyesayı}`).replace("{user}", `${user}`).replace("{kurucu}", `${kurucu}`).replace("{kanal}", `${kanal}`).replace("{tag}", `${tag}`)}`
        message.channel.send(`${kadir}`)
    }
}
})

//////////////////////////

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

////-----------------------------\\\\\\\\\
client.on('ready', () => {

  // Oynuyor Kısmı
  
      var actvs = [
        `-yardım ${client.guilds.cache.size} sunucuyu`,
        `-yardım ${client.users.cache.size} Kullanıcıyı`, 
        `-yardım`
    ];
    
    client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING' });
    setInterval(() => {
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING'});
    }, 15000);
    
  
      console.log ('_________________________________________');
      console.log (`Bot İsmi     : ${client.user.username}`);
      console.log (`Sunucular          : ${client.guilds.cache.size}`);
      console.log (`Kullanıcılar       : ${client.users.cache.size}`);
      console.log (`Prefix             : -`);
      console.log (`Durum              : Bot Çevrimiçi!`);
      console.log (`Bot Sahibi         : Kadir`);
      console.log (`Bot Durum          : Bot Hatasız Bir Şekilde Başlatıldı.`);
      console.log ('_________________________________________');
    
    });
/////



client.login(client.ayarlar.token)
