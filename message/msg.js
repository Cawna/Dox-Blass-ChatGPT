"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage, downloadMediaMessage } = require("@adiwajshing/baileys");
const { color, bgcolor } = require("../lib/color");
const fetch = require("node-fetch");
const fs = require("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn, execSync } = require("child_process");
let setting;
const { ownerNumber, MAX_TOKEN, OPENAI_KEY } = setting = require('../config.json');
const speed = require("performance-now");
const ffmpeg = require("fluent-ffmpeg");
let { ytmp4, ytmp3, ytplay, ytplayvid } = require('../lib/youtube')
const { mediafireDl, getGroupAdmins } = require('../lib/myfunc')
const axios = require("axios");
const cheerio = require("cheerio");
moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async (conn, msg, m, openai) => {
  try {
    //if (msg.key.fromMe) return
    const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe } = msg;
    const toJSON = (j) => JSON.stringify(j, null, "\t");
    const from = msg.key.remoteJid;
    const chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
    const args = chats.split(" ");
    const args22 = chats.trim().split(/ +/).slice(1)
    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#,|÷?;:%^&./\\©^]/gi) : null;
    const command = prefix ? chats.slice(1).trim().split(' ').shift().toLowerCase() : ''
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const groupMetadata = msg.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = msg.isGroup ? groupMetadata.subject : ''  
    const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
    const userId = sender.split("@")[0]
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const isOwner = [botNumber,...ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
    const pushname = msg.pushName;
    const q = chats.slice(command.length + 1, chats.length);
    const textoo = args22.join(" ")  
    const isCmd = chats.startsWith(prefix)
    const content = JSON.stringify(msg.message)
    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isAudio = (type == 'audioMessage')
    const isSticker = (type == 'stickerMessage')
    const isDocument = (type == 'documentMessage')
    const isLocation = (type == 'locationMessage')
    const isViewOnce = (type == 'viewOnceMessageV2')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false    
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
    const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
    const textolink = decodeURIComponent(chats.replace(command, '').replace(prefix, '').split(' ').join(''))  
    const textosinespacio = decodeURIComponent(chats.replace(command, '').replace(prefix, ''))
    const participants = msg.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = msg.isGroup ? await getGroupAdmins(participants) : ''
    const isAdmin = msg.isGroup ? groupAdmins.includes(sender) : false
    let senderJid;
    if (msg.isGroup) {
    senderJid = msg.key.participant;
    } else {
    senderJid = msg.sender;}
    
/* Baneo de chats */

try {    
let banned = global.db.data.chats[from].mute  
if (banned && !chats.includes('unmute')) return  
} catch { 
}  
  
/* Envios de mensajes */ 
    
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: msg });
};
const tempButton = async (remoteJid, text, footer, content) => {
const templateMessage = { viewOnceMessage: { message: { templateMessage: { hydratedTemplate: { hydratedContentText: text, hydratedContentFooter: footer, hydratedButtons: content, }, }, }, }, };
const sendMsg = await conn.relayMessage(remoteJid, templateMessage, {}); 
};
const sendAud = (link) => { 
conn.sendMessage(from, { audio: { url: link }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });
};
const sendVid = (link, thumbnail) => {
conn.sendMessage( from, { video: { url: link }, fileName: `error.mp4`, thumbnail: thumbnail, mimetype: 'video/mp4' }, { quoted: msg });
};      
const sendImgUrl = (link) => {
conn.sendMessage( from, { image: { url: link }, fileName: `error.jpg` }, { quoted: msg });
};         
      
/* Auto Read & Presence Online */
conn.readMessages([msg.key]);
conn.sendPresenceUpdate("available", from);

    // Logs;
    if (!isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), ":", chats);
    }
    if (isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), "in", color(groupName), ":", chats);
    }

switch (command) {
case 'start': case 'menu':
var textReply = `© 𝗗𝝮̶𝗫 𝗕𝗟𝗔𝗦𝗦 𝗕𝝮̶𝗧 | 𝗢𝗣𝗘𝗡𝗔𝗜 𝗖𝗛𝗔𝗧 𝗚𝗣𝗧

 • @${senderJid.split`@`[0] || pushname || 'user'} Acá te muestro todos los comandos que tengo disponible.

𠔉⃝ COMANDOS GENERALES (💡)
₊❏ ${prefix}mute
₊❏ ${prefix}unmute
₊❏ ${prefix}ping
₊❏ ${prefix}runtime

𠔉⃝ COMANDOS CHATGPT (🤖)
₊❏ ${prefix}chatgpt
₊❏ ${prefix}chatgpt2
₊❏ ${prefix}delchatgpt
₊❏ ${prefix}dall-e

𠔉⃝ COMANDOS MULTIMEDIA (💾)
₊❏ ${prefix}play-audio
₊❏ ${prefix}play-video
₊❏ ${prefix}ytmp3
₊❏ ${prefix}ytmp4
₊❏ ${prefix}sticker
₊❏ ${prefix}mediafire

𠔉⃝ COMANDOS | GRUPOS (📱)
₊❏ ${prefix}hidetag
₊❏ ${prefix}promote
₊❏ ${prefix}demote

𠔉⃝ COMANDOS CREADOR (💰)
₊❏ ${prefix}update
₊❏ ${prefix}desactivarwa

© Bot Creado Por Tiago
   Contacto: @51946352266`
if (msg.isGroup) {
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: msg });    
} else {
let fkontak2 = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${senderJid.split('@')[0]}:${senderJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: fkontak2 });  
}
break
case 'runtime':   
conn.sendMessage(from, { text: `*${require('../lib/myfunc').runtime(process.uptime())}*` }, { quoted: msg });    
break
case 'hidetag':
if (!msg.isGroup) return conn.sendMessage(from, { text: `Este comando solo puede ser usado en grupos` }, { quoted: msg }) 
if (!isAdmin) return conn.sendMessage(from, { text: `Este comando solo puede ser usado por admins del grupo` }, { quoted: msg })    
try {
let users = participants.map(u => u.id).filter(id => id);
let htextos = `${textoo ? textoo : ''}`
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.jpg`)    
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
conn.sendMessage(from, { image: mediax, mentions: users, caption: htextos, mentions: users }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
} else if (isVideo || isQuotedVideo) {
await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${senderJid.split("@")[0]}.mp4`) 
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.mp4`)    
conn.sendMessage(from, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.mp4`)    
} else if (isAudio || isQuotedAudio) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.mp3`)   
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.mp3`)    
conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.mp3`)    
} else if (isSticker || isQuotedSticker) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.jpg`) 
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.jpg`)    
conn.sendMessage(from, {sticker: mediax, mentions: users}, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.jpg`)    
} else {
await conn.sendMessage(from, { text : `${htextos}`, mentions: users }, { quoted: msg })}
} catch {
conn.sendMessage(from, { text: `Para usar este comando debe agregar un texto o responder a una imagen o video` }, { quoted: msg })}    
break     
case 'promote': 
 if (!msg.isGroup) return conn.sendMessage(from, { text: `Este comando solo puede ser usado en grupos.` }, { quoted: msg })  
 if (!isAdmin) return conn.sendMessage(from, { text: `Este comando solo puede ser usado por admins del grupo.` }, { quoted: msg })   
 let iuser = `${msg.quotedMsg ? msg.quotedMsg.key.participant || '' : ''}${msg.mentioned ? msg.mentioned : ''}`       
 if (!iuser) return conn.sendMessage(from, { text: `Uso correcto del comando:\n•${prefix}promote @${senderJid.split`@`[0] || 'tag'}\n•${prefix}promote  <responder a un mensaje>`, mentions: [senderJid] }, { quoted: msg });                      
 try { 
 var userrr = ''; 
 if (msg.quotedMsg && msg.quotedMsg.key && msg.quotedMsg.key.participant) { 
 userrr = msg.quotedMsg.key.participant; 
 } else if (msg.mentioned && msg.mentioned.length > 0) { 
 userrr = msg.mentioned[0]; 
 }} catch(e) { 
 console.log(e); 
 } finally { 
 if (userrr) { 
 if (groupAdmins.includes(userrr)) { 
 conn.sendMessage(from, { text: `@${userrr.split`@`[0] || 'user'} Ahora es un administrador.`, mentions: [userrr] }, { quoted: msg });  
 } else { 
 conn.groupParticipantsUpdate(from, [userrr], 'promote') 
 conn.sendMessage(from, { text: ` @${userrr.split`@`[0] || 'user'} Ahora es un administrador.`, mentions: [userrr] }, { quoted: msg })}}} 
 break 
 case 'demote': 
 if (!msg.isGroup) return conn.sendMessage(from, { text: `Este comando solo puede ser usado en grupos` }, { quoted: msg })  
 if (!isAdmin) return conn.sendMessage(from, { text: `Este comando solo puede ser usado por admins del grupo` }, { quoted: msg })   
 let iuser2 = `${msg.quotedMsg ? msg.quotedMsg.key.participant || '' : ''}${msg.mentioned ? msg.mentioned : ''}`       
 if(!iuser2) return conn.sendMessage(from, { text: `Uso correcto del comando:\n•${prefix}demote @${senderJid.split`@`[0] || 'tag'}\n• ${prefix}demote <responder a un mensaje>`, mentions: [senderJid] }, { quoted: msg });                      
 try { 
 var userrr2 = ''; 
 if (msg.quotedMsg && msg.quotedMsg.key && msg.quotedMsg.key.participant) { 
 userrr2 = msg.quotedMsg.key.participant; 
 } else if (msg.mentioned && msg.mentioned.length > 0) { 
 userrr2 = msg.mentioned[0]; 
 }} catch (e) { 
 console.log(e); 
 } finally { 
 if (userrr2) { 
 if (!groupAdmins.includes(userrr2)) { 
 conn.sendMessage(from, { text: `@${userrr2.split`@`[0] || 'user'} Ya no es parte de los administradores.`, mentions: [userrr2] }, { quoted: msg });  
 } else { 
 conn.groupParticipantsUpdate(from, [userrr2], 'demote') 
 conn.sendMessage(from, { text: `@${userrr2.split`@`[0] || 'user'} Ya no es parte de los administradores.`, mentions: [userrr2] }, { quoted: msg })}}}  
break    
case 'ping':
var timestamp = speed();
var latensi = speed() - timestamp
conn.sendMessage(from, { text: `Tiempo de respuesta: ${latensi.toFixed(4)}s` }, { quoted: msg });  
break     
case 'mute': case 'banchat':    
if (isGroup && !isAdmin) return conn.sendMessage(from, { text: `Este comando solo puede ser usado por admins del grupo` }, { quoted: msg });  
if (global.db.data.chats[from].mute) return conn.sendMessage(from, { text: `Este chat ya estaba muteado (baneado) desde antes` }, { quoted: msg });      
global.db.data.chats[from].mute = true
conn.sendMessage(from, { text: `Este chat se ha muteado (baneado) correctamente, el Bot no responderá a ningun mensaje hasta ser desbaneado con el comando ${prefix}unmute` }, { quoted: msg });    
break           
case 'unmute': case 'unbanchat':
if (isGroup && !isAdmin) return conn.sendMessage(from, { text: `Este comando solo puede ser usado por admins del grupo` }, { quoted: msg }); 
if (!global.db.data.chats[from].mute) return conn.sendMessage(from, { text: `Este chat no esta muteado (baneado)` }, { quoted: msg });    
global.db.data.chats[from].mute = false
conn.sendMessage(from, { text: `Este chat ha sido desmuteado (desbaneado) correctamente, ahora el Bot responderá con normalidad` }, { quoted: msg });    
break          
case 'play-audio':
if (!textoo) return conn.sendMessage(from, { text: `¿Qué audio estas buscando?` }, { quoted: msg });     
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${textoo}`) 
let json = await res.json()
let kingcore = await ytplay(textoo)
let audiodownload = json.result.audio
if (!audiodownload) audiodownload = kingcore.result
await conn.sendMessage(from, { audio: { url: `${audiodownload}` }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });    
break
case 'play-video':    
if (!textoo) return conn.sendMessage(from, { text: `¿Qué vídeo estas buscando?` }, { quoted: msg });
let mediaa = await ytplayvid(textoo)
await conn.sendMessage(from, { video: { url: mediaa.result }, fileName: `error.mp4`, thumbnail: mediaa.thumb, mimetype: 'video/mp4' }, { quoted: msg });
break   
case 'ytmp3':
if (!textolink) return conn.sendMessage(from, { text: `Ingresa el enlace de un video de YouTube` }, { quoted: msg });     
let ress22 = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=BrunoSobrino&url=${textolink}`) 
let jsonn22 = await ress22.json()
let kingcoreee2 = await ytmp3(textolink)
let audiodownloaddd2 = jsonn22.result.link
if (!audiodownloaddd2) audiodownloaddd2 = kingcoreee2.result
await conn.sendMessage(from, { audio: { url: `${audiodownloaddd2}` }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });   
break        
case 'ytmp4':
if (!textolink) return conn.sendMessage(from, { text: `Ingresa el enlace de un video de YouTube` }, { quoted: msg });     
let ress2 = await fetch(`https://api.lolhuman.xyz/api/ytvideo?apikey=BrunoSobrino&url=${textolink}`) 
let jsonn2 = await ress2.json()
let kingcoreee = await ytmp4(textolink)
let videodownloaddd = jsonn2.result.link.link
if (!videodownloaddd) videodownloaddd = kingcoreee.result
await conn.sendMessage(from, { video: { url: videodownloaddd }, fileName: `error.mp4`, thumbnail: `${kingcoreee.thumb || ''}`, mimetype: 'video/mp4' }, { quoted: msg });  
break    
case 'dall-e': case 'draw': 
if (!textoo) return conn.sendMessage(from, { text: `Ingrese un texto el cual sera la tematica de la imagen y así usar la función de la IA Dall-E` }, { quoted: msg });     
try {       
const responsee = await openai.createImage({ prompt: textoo, n: 1, size: "512x512", });    
conn.sendMessage(from, { image: { url: responsee.data.data[0].url }, fileName: `error.jpg` }, { quoted: msg });  
} catch (jj) {
try {    
conn.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/dall-e?apikey=BrunoSobrino&text=${textoo}` }, fileName: `error.jpg` }, { quoted: msg });  
} catch (jj2) {
conn.sendMessage(from, { text: "Error, no se obtuvo ninguna imagen de la IA...\n\n• Error:" + jj2 }, { quoted: msg });   
}}
break 
case 'update':
if (!isOwner) return conn.sendMessage(from, { text: `Este comando solo puede ser utilizado por el Owner del Bot` }, { quoted: msg });    
try {    
let stdout = execSync('git pull' + (m.fromMe && q ? ' ' + q : ''))
await conn.sendMessage(from, { text: stdout.toString() }, { quoted: msg });
} catch { 
let updatee = execSync('git remote set-url origin https://github.com/BrunoSobrino/openai-botwa.git && git pull')
await conn.sendMessage(from, { text: updatee.toString() }, { quoted: msg })}  
break
case 'desactivarwa':      
if (!isOwner) return conn.sendMessage(from, { text: `Este comando solo puede ser utilizado por el Owner del Bot` }, { quoted: msg });
if (!q || !args[1] || !textoo) return conn.sendMessage(from, { text: `Ingrese un número.` }, { quoted: msg });
let ntah = await axios.get("https://www.whatsapp.com/contact/noclient/")
let email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=10")
let cookie = ntah.headers["set-cookie"].join("; ")
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "ID")
form.append("phone_number", q)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", "Perdido/roubado: desative minha conta")
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1006630858")
form.append("__comment_req", "0")
let ressss = await axios({ url, method: "POST", data: form, headers: { cookie } })
var payload = String(ressss.data)
if (payload.includes(`"payload":true`)) {
conn.sendMessage(from, { text: `##- WhatsApp Support -##\n\nHola,\n\nGracias por tu mensaje.\n\nHemos desactivado tu cuenta de WhatsApp. Esto significa que su cuenta está deshabilitada temporalmente y se eliminará automáticamente en 30 días si no vuelve a registrar la cuenta. Tenga en cuenta: el equipo de atención al cliente de WhatsApp no puede eliminar su cuenta manualmente.\n\nDurante el período de cierre:\n • Es posible que sus contactos en WhatsApp aún vean su nombre y foto de perfil.\n • Cualquier mensaje que sus contactos puedan enviar a la cuenta permanecerá en estado pendiente por hasta 30 días.\n\nSi desea recuperar su cuenta, vuelva a registrar su cuenta lo antes posible.\nVuelva a registrar su cuenta ingresando el código de 6 dígitos, el código que recibe por SMS o llamada telefónica. Si te vuelves a registrar\n\nSi tiene alguna otra pregunta o inquietud, no dude en ponerse en contacto con nosotros. Estaremos encantados de ayudar!` }, { quoted: msg });
} else if (payload.includes(`"payload":false`)) {
conn.sendMessage(from, { text: `##- WhatsApp Support -##\n\nHola:\n\nGracias por tu mensaje.\n\nPara proceder con tu solicitud, necesitamos que verifiques que este número de teléfono te pertenece. Por favor, envíanos documentación que nos permita verificar que el número es de tu propiedad, como una copia de la factura telefónica o el contrato de servicio.\n\nPor favor, asegúrate de ingresar tu número de teléfono en formato internacional completo. Para obtener más información sobre el formato internacional, consulta este artículo.\n\nSi tienes alguna otra pregunta o inquietud, no dudes en contactarnos. Estaremos encantados de ayudarte.` }, { quoted: msg });
} else conn.sendMessage(from, { text: util.format(JSON.parse(res.data.replace("for (;;);", ""))) }, { quoted: msg });  
break   
case 'mediafiredl':
if (!textolink) return conn.sendMessage(from, { text: `Ingrese un enlace valido de mediafire.` }, { quoted: msg });            
let resss2 = await mediafireDl(textolink)
let caption = `*📓 Nombre:* ${resss2.name}\n*📁 Peso:* ${resss2.size}\n*📄 Tipo:* ${resss2.mime}`.trim()
await conn.sendMessage(from, { text: caption }, { quoted: msg });
await conn.sendMessage(from, { document : { url: resss2.link }, fileName: resss2.name, mimetype: resss2.mime.toUpperCase() }, { quoted: msg })       
break
case 'chatgpt': case 'tiago': 
if (!textoo) return conn.sendMessage(from, { text: `¿En que puedo ayudarte hoy día?` }, { quoted: msg });    
try {    
let chgptdb = global.chatgpt.data.users[senderJid];
chgptdb.push({ role: 'user', content: textoo });
const config = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_KEY }, data: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': [{ role: 'system', content: 'Actuaras como un Bot de WhatsApp y tu lenguaje principal es español,tu seras Dox Blass y fuiste creado por Tiago (Cawna) +51 946 352 266' }, ...chgptdb ]})}
let response = await axios(config);
chgptdb.push({ role: 'assistant', content: response.data.choices[0].message.content }) 
conn.sendMessage(from, { text: `${response.data.choices[0].message.content}`.trim() }, { quoted: msg });  
} catch (efe1) {
try {
let IA = await fetch(`https://api.amosayomide05.cf/gpt/?question=${textoo}&string_id=${senderJid}`)  
let IAR = await IA.json()
conn.sendMessage(from, { text: `${IAR.response}`.trim() }, { quoted: msg });
} catch {
try {
const BotIA222 = await openai.createCompletion({ model: "text-davinci-003", prompt: textoo, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
conn.sendMessage(from, { text: BotIA222.data.choices[0].text.trim() }, { quoted: msg });
} catch (efe2) {
try {  
let Rrres = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textoo}&apikey=tamvan`)
let Jjjson = await Rrres.json()
conn.sendMessage(from, { text: Jjjson.data.data.trim() }, { quoted: msg });
} catch (efe3) {        
try {   
let tioress22 = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textoo}&user=${senderJid}`)
let hasill22 = await tioress22.json()
conn.sendMessage(from, { text: `${hasill22.result}`.trim() }, { quoted: msg });
} catch (efe4) {    
console.log(efe4)}}}}}
break 
case 'delchatgpt':
try {
delete global.chatgpt.data.users[senderJid]  
conn.sendMessage(from, { text: `Se elimino con exito el historial de mensajes entre usted y ChatGPT (IA)` }, { quoted: msg });  
} catch (error1) {   
console.log(error1)
conn.sendMessage(from, { text: `Error, vuelva a intentarlo.` }, { quoted: msg });  
}   
break    
case 'chatgpt2': case 'cawna':      
if (!textoo) return reply(`¿Qué deseas aprender hoy día?`)           
try {
let IA2 = await fetch(`https://api.amosayomide05.cf/gpt/?question=${textoo}&string_id=${senderJid}`)  
let IAR2 = await IA2.json()
reply(`${IAR2.response}`.trim())    
} catch {
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: textoo, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (qe) {
try {   
let rrEes = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textoo}&apikey=tamvan`)
let jjJson = await rrEes.json()
reply(jjJson.data.data.trim())    
} catch (qe4) {      
try {    
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textoo}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())   
} catch (qqe) {        
reply("Error, no se obtuvieron respuestas de la IA...\n\n• Error:" + qqe)  
}}}}
break       
case 'sticker': case 's':
try {        
const pname = 'Tiago (Cawna)'
const athor = '© 𝗗𝝮̶𝗫 𝗕𝗟𝗔𝗦𝗦 𝗕𝝮̶𝗧'
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, "image", `./tmp/${sender.split("@")[0]}.jpeg`)
var media = fs.readFileSync(`./tmp/${sender.split("@")[0]}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(`./tmp/${sender.split("@")[0]}.jpeg`)
} else {
if(isVideo || isQuotedVideo) {
var media = await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(media)
} else {
const imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, {});
let filenameJpg = "stk.jpg";
fs.writeFileSync(filenameJpg, imageBuffer);
await ffmpeg('./' + filenameJpg).input(filenameJpg).on('start', function(cmd){
console.log(`Started: ${cmd}`)
}).on('error', function(err) {
console.log(`Error: ${err}`);
reply('error')}).on('end', async function() {
console.log('Finish')
await conn.sendMessage(from, { sticker: { url:'stk.webp' }})
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save('stk.webp');
}}} catch {     
reply(`Responda a una imagen, gif o video, el cual será convertido en sticker, recuerde que debe mandar una imagen o responder a una imagen con el comando ${prefix + command}`)        
}
break 
default:
const botNumber22 = '@' + conn.user.id.split(":")[0];
if (msg.key.fromMe || msg.sender == conn.user.id) return //console.log('[❗] Unicamente respondo mensajes sin comandos de otros usuarios pero no se mi mismo')    
if (!chats.startsWith(botNumber22) && isGroup) return
if (isImage || isVideo || isSticker || isViewOnce || isAudio || isDocument || isLocation) return
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '')
const lines = chatstext.split('\n');
lines[0] = lines[0].replace('@', '').replace(prefix, '').replace(/^\s+|\s+$/g, '');
const resultLines = lines.join('\n');
if (isGroup) chatstext = resultLines //chatstext.replace("@", '').replace(prefix, '')
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
let chgptTdb = global.chatgpt.data.users[senderJid];
chgptTdb.push({ role: 'user', content: chatstext });
const conNfig = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_KEY }, data: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': [{ role: 'system', content: 'Actuaras como un Bot de WhatsApp y tu lenguaje principal es español, tu seras Dox Blass y fuiste creado por Tiago (Cawna) +51 946 352 266' }, ...chgptTdb ]})}
let responNse = await axios(conNfig);
chgptTdb.push({ role: 'assistant', content: responNse.data.choices[0].message.content }) 
reply(responNse.data.choices[0].message.content)  
} catch {   
try {
let IA3 = await fetch(`https://api.amosayomide05.cf/gpt/?question=${chatstext}&string_id=${senderJid}`)  
let IAR3 = await IA3.json()
reply(`${IAR3.response}`.trim())    
} catch {  
try {
const response = await openai.createCompletion({ model: "text-davinci-003", prompt: chatstext, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(response.data.choices[0].text.trim())
} catch (eee1) {
try {
let rresSS = await fetch(`https://api.ibeng.tech/api/info/openai?text=${chatstext}&apikey=tamvan`)
let jjsonNN = await rresSS.json()
reply(jjsonNN.data.data.trim())     
} catch (eee) {  
try {    
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chatstext}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())   
} catch (eeee) {        
reply("Error, no se obtuvieron respuestas de la IA...\n\n• Error:" + eeee)  
}}}}}
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
