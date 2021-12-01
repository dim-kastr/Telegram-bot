require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const M = require('telegraf-markup4');
const COUNTRIES_LIST = require('./constants');


const bot = new Telegraf(process.env.BOTILOVE);
bot.start((ctx) => ctx.reply(`
Привет, дорогой ${ctx.message.from.first_name} ${ctx.message.from.last_name}!
Здесь DimBot - флексер показывает статистику по короне
Напиши ему страну на английском, которую хочешь чекнуть
Весь список стран можно глянуть, написав /help`
, M.keyboard.reply([
      ['US', 'Russia'],
      ['Ukraine', 'Canada'], 
    ]))
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};

  try {
  data = await api.getReportsByCountries(ctx.message.text);

  const formatData = `
Страна:  ${data[0][0].country}
Случаи заражения (24ч):  ${data[0][0].cases}
Смертей (24ч):  ${data[0][0].deaths}
Выздоровело (24ч):  ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
    } catch {
        ctx.reply('Ошибка, такой страны не существует!!! Посмотрите /help');
    } 
});

bot.launch();

// eslint-disable-next-line no-console
console.log('Бот запущен');
