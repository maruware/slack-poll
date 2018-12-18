const logger = require('log4js').getLogger()

module.exports = (bot, msg) => {
  let value = msg.actions[0].value
  value = parseInt(value, 10)

  const attachments = msg.original_message.attachments
  const descAttachment = attachments.shift()
  const username = `<@${msg.user}>`
  descAttachment.text = descAttachment.text
    .split('\n')
    .map((line, idx) => {
      if (idx === value) {
        const match = line.match(/^([^`]+)\s*(`([1-9]+)`)*\s*([^`]+)*$/)
        if (!match) {
          return line
        }
        logger.debug('match', match)
        const org = match[1]
        let count = match[3] ? parseInt(match[3], 10) : 0
        let users = match[4]

        // Add or remove user
        if (users && users.includes(username)) {
          users = users.replace(username, '')
          count -= 1
        } else {
          users = `${users || ''} ${username}`
          count += 1
        }
        if (count <= 0) {
          return org
        }
        return `${org} \`${count}\` ${users}`
      }
      return line
    })
    .join('\n')

  bot.replyInteractive(msg, {
    attachments: [descAttachment, ...attachments]
  })
}
