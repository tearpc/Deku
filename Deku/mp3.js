const { toAudio } = require('../lib/converter')

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
  if (!/video|audio/.test(mime)) throw `ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ ᴠɪᴅᴇᴏ ᴏʀ ᴠᴏɪᴄᴇ ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ᴛᴏ ᴍᴘ3`
  let media = await q.download()
  let audio = await toAudio(media, 'mp4')
  conn.sendFile(m.chat, audio, '', '', m, 0, { mimetype: 'audio/mp4' })
}
handler.help = ['mp3','audio']
handler.tags = ['audio']

handler.command = /^mp3|audio?)$/i

module.exports = handler
