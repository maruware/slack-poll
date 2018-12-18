const logger = require('log4js').getLogger()
const poll = require('./poll')

module.exports = controller => {
  controller.on('interactive_message_callback', (bot, msg) => {
    logger.info('interactive_message_callback callback_id', msg.callback_id)
    if (msg.callback_id === 'poll') {
      poll(bot, msg)
    }
  })
}
