const log4js = require('log4js')
const poll = require('./poll')

const logger = log4js.getLogger()

module.exports = controller => {
  controller.on('slash_command', (bot, msg) => {
    logger.info('slash_command', msg.command)
    if (msg.command === '/poll') {
      poll(bot, msg)
    }
  })
}
