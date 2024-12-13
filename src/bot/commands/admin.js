// реализовать получения фотки из AWS и данных из БД

import { config } from "../../config.js";
import { isAdmin } from "../../db/checkUserOnStart.js";

export const adminCommand = async (ctx) => {
    const user = await isAdmin(ctx.from.id);

    if (!user) {
        ctx.reply("Вы не администратор!");
    } else {
        ctx.reply(`${user.full_name}, добро пожаловать в центр управления`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Открывайте',
                        web_app: { url: config.webAppUrlAdmin }
                    }],
                ],
            }
        });
    }
}