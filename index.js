require('dotenv').config();
const Telegraf = require(`telegraf`);
const Markup = require('telegraf/markup')
const covidService = require('./src/services/covid');
const formatCountryMsg = require('./src/messages/country');
const COUNTRIES = require('./src/countries')

const PORT = process.env.PORT || 5000;
const URL = process.env.URL;
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

console.log(URL)

// commands
// start, help
bot.start(ctx => ctx.reply(`
Welcome to COVID-19 BOT!
Type country name and get the most up-to-date information about COVID-19.
Try /help command to see how to use this bot.
`,
Markup.keyboard([
  ['Russia', 'Ukraine'],
  ['Kazakhstan', 'Uzbekistan'],
  ['Belarus', 'Kyrgyzstan'],
]).extra()
));
bot.help((ctx) => ctx.reply(COUNTRIES))
// handlers
bot.hears(/.*/, async ctx => {
  const {data} = await covidService.getByCountry(ctx.message.text);
  
  if(data && data.results === 0){
    return ctx.reply('Country has not found. Try again later');
  }

  return ctx.replyWithMarkdown(formatCountryMsg(data.response[0]))
});


// launch
if (process.env.NODE_ENV === 'production') {
	bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`)
	bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)
} else {
	bot
		.launch()
		.then(() => console.log(`Launched at ${new Date()}`))
		.catch((err) => console.log(`ERROR at launch:`, err))
}