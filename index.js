const config = require('config')
const log4js = require('log4js')

const Botkit = require('botkit')
const slash = require('./src/slash')
const interactive = require('./src/interactive')

log4js.configure(config.log4js)

async function setTeam(controller, bot) {
  const res = await new Promise((resolve, reject) => {
    bot.api.team.info({}, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
  await new Promise((resolve, reject) => {
    controller.storage.teams.save(
      {
        id: res.team.id,
        bot: {
          user_id: bot.identity.id,
          name: bot.identity.name
        }
      },
      err => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

function startWebServer(controller, port) {
  return new Promise((resolve, reject) => {
    controller.setupWebserver(port, (err, webserver) => {
      if (err) {
        reject(err)
      } else {
        controller.createWebhookEndpoints(webserver)
        resolve()
      }
    })
  })
}

async function setup() {
  const controller = Botkit.slackbot({
    debug: process.env.DEBUG,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    clientSigningSecret: process.env.CLIENT_SIGNING_SECRET
  })

  const bot = controller.spawn({
    token: process.env.TOKEN
  })
  await setTeam(controller, bot)
  slash(controller)
  interactive(controller)

  const port = process.env.PORT || 8080
  await startWebServer(controller, port)
}

setup()
