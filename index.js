require('dotenv').config()
const { Telegraf } = require('telegraf')
const crawler = require('./crawler')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))

bot.on('text', async (ctx) => {
    const links = await crawler.getOrganicResults(ctx.message.text)
    
    for (let index = 0; index < links.length; index++) {
        ctx.reply(links[index])
        
    }
})

bot.launch()
