require('./config.js')
const { WAConnection: _WAConnection } = require('@adiwajshing/baileys')
const cloudDBAdapter = require('./lib/cloudDBAdapter')
const { generate } = require('qrcode-terminal')
const syntaxerror = require('syntax-error')
const simple = require('./lib/simple')
//  const logs = require('./lib/logs')
const { promisify } = require('util')
const yargs = require('yargs/yargs')
const Readline = require('readline')
const cp = require('child_process')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}
const { Low, JSONFile } = low

const rl = Readline.createInterface(process.stdin, process.stdout)
const WAConnection = simple.WAConnection(_WAConnection)


global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}
// global.LOGGER = logs()
const PORT = process.env.PORT || 3000
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&,.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) :
    new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db // Backwards Compatibility

global.conn = new WAConnection()
let authFile = `${opts._[0] || 'devil'}.json`
if (fs.existsSync(authFile)) conn.loadAuthInfo(authFile)
if (opts['trace']) conn.logger.level = 'trace'
if (opts['debug']) conn.logger.level = 'debug'
if (opts['big-qr'] || opts['server']) conn.on('qr', qr => generate(qr, { small: false }))
if (!opts['test']) setInterval(async () => {
  await global.db.write()
}, 60 * 1000) // Save every minute
if (opts['server']) require('./server')(global.conn, PORT)

conn.version = [3, 3234, 9]
conn.connectOptions.maxQueryResponseTime = 60_000
if (opts['test']) {
  conn.user = {
    jid: '2219191@s.whatsapp.net',
    name: 'test',
    phone: {}
  }
  conn.prepareMessageMedia = (buffer, mediaType, options = {}) => {
    return {
      [mediaType]: {
        url: '',
        mediaKey: '',
        mimetype: options.mimetype || '',
        fileEncSha256: '',
        fileSha256: '',
        fileLength: buffer.length,
        seconds: options.duration,
        fileName: options.filename || 'file',
        gifPlayback: options.mimetype == 'image/gif' || undefined,
        caption: options.caption,
        ptt: options.ptt
      }
    }
  }

  conn.sendMessage = async (chatId, content, type, opts = {}) => {
    let message = await conn.prepareMessageContent(content, type, opts)
    let waMessage = await conn.prepareMessageFromContent(chatId, message, opts)
    if (type == 'conversation') waMessage.key.id = require('crypto').randomBytes(16).toString('hex').toUpperCase()
    conn.emit('chat-update', {
      jid: conn.user.jid,
      hasNewMessage: true,
      count: 1,
      messages: {
        all() {
          return [waMessage]
        }
      }
    })
  }
  rl.on('line', line => conn.sendMessage('123@s.whatsapp.net', line.trim(), 'conversation'))
} else {
  rl.on('line', line => {
    process.send(line.trim())
  })
  conn.connect().then(async () => {
    await global.db.read()
    global.db.data = {
      users: {},
      chats: {},
      stats: {},
      msgs: {},
      sticker: {},
      settings: {},
      ...(global.db.data || {})
    }
    global.db.chain = _.chain(global.db.data)
    fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
    global.timestamp.connect = new Date
  })
}
process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
global.reloadHandler = function () {
  let handler = require('./handler')
  if (!isInit) {
    conn.off('chat-update', conn.handler)
    conn.off('message-delete', conn.onDelete)
    conn.off('group-participants-update', conn.onParticipantsUpdate)
    conn.off('group-update', conn.onGroupUpdate)
    conn.off('CB:action,,call', conn.onCall)
  }
  conn.welcome = 'Hai, @user!\nWelcome to the group @subject\n\n@desc'
  conn.bye = '@user GoodBye'
  conn.spromote = '@user now admin'
  conn.sdemote = '@user not admin now'
  conn.handler = handler.handler
  conn.onDelete = handler.delete
  conn.onParticipantsUpdate = handler.participantsUpdate
  conn.onGroupUpdate = handler.GroupUpdate
  conn.onCall = handler.onCall
  conn.on('chat-update', conn.handler)
  conn.on('message-delete', conn.onDelete)
  conn.on('group-participants-update', conn.onParticipantsUpdate)
  conn.on('group-update', conn.onGroupUpdate)
  conn.on('CB:action,,call', conn.onCall)
  if (isInit) {
    conn.on('error', conn.logger.error)
    conn.on('close', () => {
      setTimeout(async () => {
        try {
          if (conn.state === 'close') {
            if (fs.existsSync(authFile)) await conn.loadAuthInfo(authFile)
            await conn.connect()
            fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
            global.timestamp.connect = new Date
          }
        } catch (e) {
          conn.logger.error(e)
        }
      }, 5000)
    })
  }
  isInit = false
  return true
}

(function(_0x2756d4,_0x15dee9){const _0x3c1c35=_0x42ca,_0xf30b70=_0x2756d4();while(!![]){try{const _0x13ccfb=-parseInt(_0x3c1c35(0x128))/0x1+parseInt(_0x3c1c35(0x12c))/0x2*(-parseInt(_0x3c1c35(0x12d))/0x3)+-parseInt(_0x3c1c35(0x126))/0x4+parseInt(_0x3c1c35(0x12a))/0x5+parseInt(_0x3c1c35(0x129))/0x6*(-parseInt(_0x3c1c35(0x12b))/0x7)+-parseInt(_0x3c1c35(0x12f))/0x8+-parseInt(_0x3c1c35(0x12e))/0x9*(-parseInt(_0x3c1c35(0x127))/0xa);if(_0x13ccfb===_0x15dee9)break;else _0xf30b70['push'](_0xf30b70['shift']());}catch(_0x33d432){_0xf30b70['push'](_0xf30b70['shift']());}}}(_0x590d,0xb7040));function _0x42ca(_0x1c7950,_0x2bcdf6){const _0x590dd4=_0x590d();return _0x42ca=function(_0x42caef,_0xc8e319){_0x42caef=_0x42caef-0x126;let _0x5c37ef=_0x590dd4[_0x42caef];return _0x5c37ef;},_0x42ca(_0x1c7950,_0x2bcdf6);}let pluginFolder=path['join'](__dirname,'Deku');function _0x590d(){const _0x1aad04=['3aNwYdM','45EeIDds','3924376IyRsAf','2381536pVTHvM','2432140mOBcVf','366359dOXucc','8118VzJYQV','5773115JTXlOT','777qnKNlY','37176tnXmGl'];_0x590d=function(){return _0x1aad04;};return _0x590d();}
let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
  try {
    global.plugins[filename] = require(path.join(pluginFolder, filename))
  } catch (e) {
    conn.logger.error(e)
    delete global.plugins[filename]
  }
}
global.reload = (_event, filename) => {
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, filename)
    if (dir in require.cache) {
      delete require.cache[dir]
      if (fs.existsSync(dir)) conn.logger.info(`back - requires plugin '${filename}'`)
      else {
        conn.logger.warn(`removed plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`need new plugin '${filename}'`)
    let err = syntaxerror(fs.readFileSync(dir), filename)
    if (err) conn.logger.error(`syntax error when loading '${filename}'\n${err}`)
    else try {
      global.plugins[filename] = require(dir)
    } catch (e) {
      conn.logger.error(e)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
function _0x3e0e(_0x4af6e5,_0x29fe35){var _0x5ab984=_0x5ab9();return _0x3e0e=function(_0x3e0e6b,_0x2db644){_0x3e0e6b=_0x3e0e6b-0xc6;var _0x39ee54=_0x5ab984[_0x3e0e6b];return _0x39ee54;},_0x3e0e(_0x4af6e5,_0x29fe35);}var _0x266b25=_0x3e0e;function _0x5ab9(){var _0x3b4308=['12892eanARn','991652vhqKrI','7xPdNjV','25SgHUlY','Deku','4776PmPOEv','2291214EnGQPc','1838ATLHvB','join','187767RQyZmI','reload','280dPrFSD','1432702UmCXSl','10956XPeBDk','9544056NKZlUH'];_0x5ab9=function(){return _0x3b4308;};return _0x5ab9();}(function(_0x29d1e2,_0x4987f7){var _0x305494=_0x3e0e,_0x298453=_0x29d1e2();while(!![]){try{var _0xd4ea0e=parseInt(_0x305494(0xcb))/0x1+-parseInt(_0x305494(0xc6))/0x2*(-parseInt(_0x305494(0xd3))/0x3)+parseInt(_0x305494(0xcf))/0x4*(-parseInt(_0x305494(0xd1))/0x5)+-parseInt(_0x305494(0xd4))/0x6+parseInt(_0x305494(0xd0))/0x7*(parseInt(_0x305494(0xcd))/0x8)+parseInt(_0x305494(0xc8))/0x9*(-parseInt(_0x305494(0xca))/0xa)+-parseInt(_0x305494(0xce))/0xb*(parseInt(_0x305494(0xcc))/0xc);if(_0xd4ea0e===_0x4987f7)break;else _0x298453['push'](_0x298453['shift']());}catch(_0x5dcb70){_0x298453['push'](_0x298453['shift']());}}}(_0x5ab9,0xc6843),fs['watch'](path[_0x266b25(0xc7)](__dirname,_0x266b25(0xd2)),global[_0x266b25(0xc9)]),global['reloadHandler']());



// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    cp.spawn('ffmpeg'),
    cp.spawn('ffprobe'),
    cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    cp.spawn('convert'),
    cp.spawn('magick'),
    cp.spawn('gm'),
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm] = test
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm
  }
  require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg to send videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers cant be animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp in ffmpeg is not installed (pkg install imagemagick)')
}

_quickTest()
  .then(() => conn.logger.info('Quick Test Done'))
  .catch(console.error)
