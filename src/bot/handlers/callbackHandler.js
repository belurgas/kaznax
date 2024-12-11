// Обработка callback'ов от inline кнопок
import { bot } from "../../bot/index.js";

export const callbackHandler = (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const userId = ctx.from.id;
  
    if (callbackData === 'next_after_reg') {
      bot.telegram.deleteMessage(userId, ctx.callbackQuery.message.message_id);
      bot.telegram.sendMessage(userId, '*Можете заглянуть на главную ➡️ /start страницу, а так ждите субботу*', {
        parse_mode: 'MarkdownV2',
      });
    } else {
      console.log(`Неизвестный callbackData: ${callbackData}`);
    }
  };