import { Telegraf } from "telegraf";
import { config } from "../config.js";

import { startCommand } from "./commands/start.js";
import { profileCommand } from "./commands/profile.js";
import { activeComa } from "./commands/active.js";
import { handleMessage } from "./handlers/messageHandler.js";
import { callbackHandler } from "./handlers/callbackHandler.js";

export const bot = new Telegraf(config.botToken);

// bot.use(loggerMiddleware);

bot.command("start", startCommand);
bot.command("profile", profileCommand);
bot.command("competition", activeComa)

bot.on("message", handleMessage);

// Обработка callback'ов от inline кнопок
bot.on('callback_query', callbackHandler);

export default function startBot() {
    bot.launch();
    console.log('Бот запущен!');
};