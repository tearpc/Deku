let handler = async (m, { command, usedPrefix, text }) => {
    let which = command.replace(/del/i, '')
    if (!text) throw `use *${usedPrefix}list${which}* to see the list`
    let msgs = global.db.data.msgs
    if (!text in msgs) throw `'${text}' not registered in message list`
    delete msgs[text]
    /*m.reply(`Successfully deleted message in message list with name '${text}'`)
}*/
  conn.fakeReply(m.chat, ' *ꜱᴜᴄᴄᴇꜱꜱ ᴅᴇʟᴇᴛᴇᴅ🗑️ ꜰʀᴏᴍ 𝚍𝚎𝚔𝚞'ꜱ ᴅᴀᴛᴀʙᴀꜱᴇ✔️* ', '0@s.whatsapp.net', ` *ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴅᴇʟᴇᴛᴇᴅ ⍟៚* ${text}`, 'status@broadcast')
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker', 'gif'].map(v => 'del' + v + ' <teks>')
handler.tags = ['database']
handler.command = /^del(vn|msg|video|audio|img|stic?ker|gif)$/

module.exports = handler
