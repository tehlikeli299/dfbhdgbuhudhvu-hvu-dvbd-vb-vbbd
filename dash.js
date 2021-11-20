const url = require("url");
const path = require("path");
const Discord = require("discord.js");
var express = require('express');
var app = express();
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const moment = require("moment");
require("moment-duration-format");
const ayarlar = require("./ayarlar.json")

module.exports = (client) => {
const templateDir = path.resolve(`${process.cwd()}${path.sep}html`);

app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}css`)));
  app.use("/img", express.static(path.resolve(`${process.cwd()}resimler`)));
//-- discord auth kısmı --f
passport.serializeUser((user, done) => {
done(null, user);
});
passport.deserializeUser((obj, done) => {
done(null, obj);
});

passport.use(new Strategy({
clientID: client.ayarlar.id,
clientSecret: client.ayarlar.oauthSecret,
callbackURL: client.ayarlar.callbackURL,
scope: ["identify","guilds"]
},
(accessToken, refreshToken, profile, done) => {
process.nextTick(() => done(null, profile));
  var accessToke = accessToken
}));

app.use(session({
secret: '123',
resave: false,
saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
//-- bitüş --
app.locals.domain = process.env.PROJECT_DOMAIN;

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
extended: true
})); 



const renderTemplate = async (res, req, template, data = {}) => {
const baseData = {
bot: client,
path: req.path,
user: req.isAuthenticated() ? req.user : null
};
res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};
//-- sayfalar --
  

app.get("/giris", (req, res, next) => {
if (req.session.backURL) {
req.session.backURL = req.session.backURL;
} else if (req.headers.referer) {
const parsed = url.parse(req.headers.referer);
if (parsed.hostname === app.locals.domain) {
req.session.backURL = parsed.path;
}
} else {
req.session.backURL = "yukleniyor.ejs";
}
    next();
},
passport.authenticate("discord"));


app.get("/callback", passport.authenticate("discord", {
  failureRedirect: "/hata?type=auth" 
}), async (req, res) => {
      if (client.ayarlar.gelistirici.includes(req.user.id)) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }

if (req.session.backURL) {
const url = req.session.backURL;
req.session.backURL = null;
res.redirect(url);
} else {
res.redirect("/");
}
  
      client.channels.cache.get("911518146828066867").send(
      new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`
      **${client.users.cache.get(req.user.id).tag}** adlı kullanıcı 
     
     **HYPREX** Web Paneline Discord hesabıyla giriş yaptı!
         `)
)
        
});


app.get("/", async (req, res) => {
renderTemplate(res, req, "index.ejs");
});
  app.get("/yukleniyor", async (req, res) => {
renderTemplate(res, req, "yukleniyor.ejs");
});

app.get("/bilgilendirme", async (req, res) => {
renderTemplate(res, req, "hakkımızda.ejs");
});
  
    app.get("/admin", (req, res) => {
if(!req.user) return res.redirect("/hata?type=giris")
if(!client.ayarlar.gelistirici.includes(req.user.id)) return res.redirect("/hata?type=hata") 
      renderTemplate(res, req, "admin.ejs");
  });
  
app.get("/davet", async (req, res) => {
renderTemplate(res, req, "davet.ejs");
});
app.get("/hata", async (req, res) => {
  let type = req.query.type || "Yazı Bulunamadı"
  let text = ""
  if(type === "auth") {
    text = "Giriş Yaparken Bir Hata Oluştu Lütfen Tekrar Deneyiniz."
  }else if(type === "eksik") {
    text = "Gerekli yerlerin hepsini doldurman gerekiyor!"
  }else if(type === "kayıt") {
    text = "Bilgileri kayıt ederken bir hata meydana geldi!"
  }else if(type === "bulunamadı") {
    text = "İstenilen yer bulunamadı!"
  }else if(type === "giris") {
    text = "Lütfen Giriş Yapınız!"
  }else if(type === "hata") {
    text = "Bu Sayfaya Erişmek İçin Gerekli Yetiye Sahip Değilsin!"
  }else if(type === "izinsizgiriş") {
    text = "Bu Sayfaya Erişmek İçin Gerekli Yetiye Sahip Değilsin!"
  }else if(type === "profilyok") {
    text = "Böyle Bir Kullanıcı Profili Yok!"
  }else if(type === "yasak") {
    text = "Başkasının Profiline Bakamazsın!"
  }
renderTemplate(res, req, "hata.ejs", {text});
});
app.get("/basarili", async (req, res) => {
  let type = req.query.type || "Yazı Bulunamadı"
  let text = ""
  if(type === "ayarlar") {
    text = "Girilen bilgiler kaydedildi!"
  }
renderTemplate(res, req, "basarili.ejs", {text});
});
app.get("/cikis", function(req, res) {
req.session.destroy(() => {
req.logout();
res.redirect("/");
});
});
  
    /// PROFİL SİSTEMİ BAŞ ///
    
app.get("/profil/:userID", async (req,res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  var nego = client.users.cache.get(req.params.userID);
  if(!nego) return res.redirect("/hata?type=profilyok");
    if (req.user.id !== req.params.userID) return res.redirect("/hata?type=yasak");
  //Data
var isim =  client.users.cache.get(req.params.userID).username;
var disc =  client.users.cache.get(req.params.userID).discriminator;
var avatar =  client.users.cache.get(req.params.userID).displayAvatarURL();
var id = client.users.cache.get(req.params.userID).id;
  renderTemplate(res,req, "profil.ejs",{
  isim,
  disc,
  avatar
  
});
});
    
   /// PROFİL SİSTEMİ SON ///
  
    app.get("/panel/:sunucuID/botuat", (req, res) => {
     if(!req.user) return res.redirect("/hata?type=giris")  
    client.guilds.cache.get(req.params.sunucuID).leave();
    res.redirect("/panel");
  });
  
    app.get("/botuekle",  (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
  });
    
    
app.get("/panel", async (req, res) => {
 if(!req.user) return res.redirect("/hata?type=giris")
     const perms = Discord.Permissions;
renderTemplate(res, req, "yonet.ejs", {perms});
});
app.get("/yonet", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.query.server
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonet/server.ejs", {id})
})
app.get("/yonetim/:id/ayar", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.params.id
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonetim/ayar.ejs", {id})
})

  
    ///ADMİN BAŞ///
  
  app.get("/admin", async (req, res) => {
  if (!req.user) return res.redirect("/hata?type=hata");
 if (!ayarlar.sahip.includes(req.user.id)) 
  res.render("admin", {
    user: req.user,
  });
});
  
  ///ADMİN SON///
  
  
    app.get("/yonetim/:id/filtre", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.params.id
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonetim/filtre.ejs", {id})
})
    app.get("/yonetim/:id/", async(req, res) => {
  if(!req.user) return res.redirect("/hata?type=giris")
  let id = req.params.id
  if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
  renderTemplate(res, req, "yonetim/log.ejs", {id})
})
  
  app.post("/yonetim/:id/ayar", async(req, res) => {
    let ayarlar = req.body
    console.log(ayarlar)
if(!req.user) return res.redirect("/hata?type=giris")
 let id = req.params.id
 if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
    if(ayarlar) {
      if(ayarlar["otorol-kanal"]) {
      client.db.set(`${id}.ayarlar.sunucu.otorol.kanal`, ayarlar["otorol-kanal"])
      }else{
        try {
        client.db.delete(`${id}.ayarlar.sunucu.otorol.kanal`)
     } catch(err) {
       
     }
      }
      if(ayarlar["otorol-rol"]) {
      client.db.set(`${id}.ayarlar.sunucu.otorol.rol`, ayarlar["otorol-rol"])
      }else{
        try {
        client.db.delete(`${id}.ayarlar.sunucu.otorol.rol`)
     } catch(err) {
       
     }
      }
      if(ayarlar["otorol-botrol"]) {
      client.db.set(`${id}.ayarlar.sunucu.otorol.botrol`, ayarlar["otorol-botrol"])
      }else{
        try {
        client.db.delete(`${id}.ayarlar.sunucu.otorol.botrol`)
     } catch(err) {
       
     }
      }
      if(ayarlar["sayac-kanal"]) {
      client.db.set(`${id}.ayarlar.sunucu.sayac.kanal`, ayarlar["sayac-kanal"])
      }else{
        try {
        client.db.delete(`${id}.ayarlar.sunucu.sayac.kanal`)
     } catch(err) {
       
     }
      }
      
         if(ayarlar["yazlıar"]) {
      client.db.set(`yazılar_${id}`, ayarlar["yazılar"])
      }else{
        try {
        client.db.delete(`yazılar_${id}`)
     } catch(err) {
       
     }
      }
      
      
          if(ayarlar["cevaplar"]) {
      client.db.set(`cevaplar_${id}`, ayarlar["cevaplar"])
      }else{
        try {
        client.db.delete(`cevaplar_${id}`)
     } catch(err) {
       
     }
      }
      
      
      
      if(ayarlar["sayac-hedef"]) {
      client.db.set(`${id}.ayarlar.sunucu.sayac.hedef`, ayarlar["sayac-hedef"])
      }else{
        try {
        client.db.delete(`${id}.ayarlar.sunucu.sayac.hedef`)
     } catch(err) {
       
     }
      }
      if(ayarlar["hgbbkanal"]) {
      client.db.set(`hgbbkanal_${id}`, ayarlar["hgbbkanal"])
      }else{
        try {
        client.db.delete(`hgbbkanal_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["prefix"]) {
      client.db.set(`prefix_${id}`, ayarlar["prefix"])
      }else{
        try {
        client.db.delete(`prefix_${id}`)
     } catch(err) {
       
     }
      }      
    if (ayarlar['otoRL']) {
client.db.set(`otoRL_${id}`, ayarlar['otoRL'])
}
      
          if (ayarlar['otoRM']) {
client.db.set(`otoRM_${id}`, ayarlar['otoRM'])
}
      
if (ayarlar['otoRK']) {
client.db.set(`otoRK_${id}`, ayarlar['otoRK'])   
}  
    }else{
      
    }
     res.redirect("/yonetim/"+req.params.id+"/ayar");
 // res.redirect("/basarili?type=ayarlar")
    })
  
  
app.post("/yonetim/:id/filtre", async(req, res) => {
    let ayarlar = req.body
if(!req.user) return res.redirect("/hata?type=giris")
 let id = req.params.id
 if(!id) return res.redirect("/hata?type=bulunamadı")
  let perm = client.guilds.cache.get(id).members.cache.get(req.user.id).permissions.has("MANAGE_GUILD")
  if(!perm) return res.redirect("/hata?type=bulunamadı")
    if(ayarlar) {
      if(ayarlar["link-engel"] === "on") {
      client.db.set(`${id}.ayarlar.filtre.link`, true)
      }else{
        try {
        client.db.delete(`${id}.ayarlar.filtre.link`)
     } catch(err) {
       
     }
      }
      if(ayarlar["reklam-engel"] === "on") {
      client.db.set(`${id}.ayarlar.filtre.reklam`, true)
      }else{
        try {
        client.db.delete(`${id}.ayarlar.filtre.reklam`)
     } catch(err) {
       
     }
      }
            if(ayarlar["spamengel"] === "aktif") {
      client.db.set(`spamengel_${id}`, true)
      }else{
        try {
        client.db.delete(`spamengel_${id}`)
     } catch(err) {
       
     }
      }
      if(ayarlar["caps-engel"] === "on") {
      client.db.set(`${id}.ayarlar.filtre.caps`, true)
      }else{
        try {
        client.db.delete(`${id}.ayarlar.filtre.caps`)
     } catch(err) {
       
     }
      }
    }else{
      
    }
      res.redirect("/yonetim/"+req.params.id+"/filtre")
  //  res.redirect("/basarili?type=ayarlar")
    })


app.listen(3000);
  
};