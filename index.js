console.log('Start...')
let { spawn } = require('child_process')
let path = require('path')
let fs = require('fs')
let package = require('./package.json')
const CFonts = require('cfonts')
CFonts.say('Deku', {
  colors: ['#f2aa4c'],
  font: 'block',
  align: 'center',
})
CFonts.say(`'${package.name}' By @${package.author.name || package.author}`, {
  colors: ['#f2aa4c'],
  font: 'console',
  align: 'center',
})

var isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return
  isRunning = true
  let args = [path.join(__dirname, file), ...process.argv.slice(2)]
  CFonts.say([process.argv[0], ...args].join(' '), {
    colors: ['#f2aa4c'],
    font: 'console',
    align: 'center',
  })
  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })
  p.on('message', data => {
    console.log('[RECEIVED]', data)
    switch (data) {
      case 'reset':
        p.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })
  p.on('exit', code => {
    isRunning = false
    console.error('Exited with code:', code)
    if (code === 0) return
    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0])
      start(file)
    })
  })
  // console.log(p)
}

function _0x325c(_0x4a07a7,_0x4c5256){var _0x3f2c51=_0x3f2c();return _0x325c=function(_0x325cde,_0x20e2a0){_0x325cde=_0x325cde-0x138;var _0x249af1=_0x3f2c51[_0x325cde];return _0x249af1;},_0x325c(_0x4a07a7,_0x4c5256);}(function(_0x1709ee,_0x293a8d){var _0x2dad46=_0x325c,_0x41411c=_0x1709ee();while(!![]){try{var _0x406a93=parseInt(_0x2dad46(0x140))/0x1*(parseInt(_0x2dad46(0x141))/0x2)+-parseInt(_0x2dad46(0x13b))/0x3*(parseInt(_0x2dad46(0x13c))/0x4)+parseInt(_0x2dad46(0x138))/0x5*(-parseInt(_0x2dad46(0x13e))/0x6)+-parseInt(_0x2dad46(0x13d))/0x7+parseInt(_0x2dad46(0x13f))/0x8*(-parseInt(_0x2dad46(0x143))/0x9)+parseInt(_0x2dad46(0x142))/0xa+-parseInt(_0x2dad46(0x13a))/0xb*(-parseInt(_0x2dad46(0x139))/0xc);if(_0x406a93===_0x293a8d)break;else _0x41411c['push'](_0x41411c['shift']());}catch(_0x49d0de){_0x41411c['push'](_0x41411c['shift']());}}}(_0x3f2c,0x9d6f2),start('Deku.js'));function _0x3f2c(){var _0x188eb2=['3933160gFBwHt','2367GrkmvD','15YKUmrp','136968iWnOZz','1859dIyywd','39wUUDuU','315744YoMgSu','6209287IfjyBc','746184RwcEyQ','14592iAmDvc','1fctuFr','2177162sNQPDI'];_0x3f2c=function(){return _0x188eb2;};return _0x3f2c();}
