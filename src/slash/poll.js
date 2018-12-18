const log4js = require('log4js')
const _ = require('lodash')

const logger = log4js.getLogger()

const numEmojis = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'keycap_ten'
]
const color = '#4FB99F'

module.exports = (bot, msg) => {
  let m = msg.text.match(/"([^"]+)"/g)
  logger.debug(m)
  if (m.length > 11) {
    return bot.replyPrivate(msg, {
      text: 'Error. Up to 10 choices.'
    })
  }

  m = m.map(e => e.slice(1, -1))

  const question = m.shift()
  const choices = m
  const desc = choices
    .map((choice, idx) => {
      return `:${numEmojis[idx]}:${choice}`
    })
    .join('\n')
  const choiceAttachments = _(choices)
    .chunk(5)
    .map((partChoices, c) => {
      return {
        color,
        fallback: "Couldn't reply.",
        callback_id: 'poll',
        attachment_type: 'default',
        actions: partChoices.map((choice, i) => {
          const n = c * 5 + i
          return {
            name: choice,
            value: n,
            text: `:${numEmojis[n]}:`,
            type: 'button'
          }
        })
      }
    })
  return bot.replyPublic(msg, {
    attachments: [
      {
        color,
        title: question,
        text: desc
      },
      ...choiceAttachments
    ]
  })
}
