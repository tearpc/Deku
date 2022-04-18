let { WAMessageProto } = require('@adiwajshing/baileys')
let handler = async (m, { command, usedPrefix, text }) => {
    let M = WAMessageProto.WebMessageInfo
    let which = command.replace(/add/i, '')
    if (!m.quoted) throw 'reply to the message!'
    if (!text) throw `use *${usedPrefix}list${which}* to see the list`
    let msgs = global.db.data.msgs
    if (text in msgs) throw `'${text}' registered in the message list`
    msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON()
    /*m.reply(`Successfully added message in message list as '${text}'
    
Access with ${usedPrefix}get${which} ${text}`)*/
    conn.fakeReply(m.chat, ' *ꜱᴜᴄᴄᴇꜱꜱ ᴀᴅᴅᴇᴅ ɪɴ 𝚍𝚎𝚔𝚞 𝚔𝚞𝚗'𝚜 ᴅᴀᴛᴀʙᴀꜱᴇ✔️* ', '0@s.whatsapp.net', ` *ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴀᴅᴅᴇᴅ ⍟៚* ${text}`, 'status@broadcast')
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker', 'gif'].map(v => 'add' + v + ' <teks>')
handler.tags = ['database']
handler.command = /^add(vn|msg|video|audio|img|sticker|gif)$/

module.exports = handler
