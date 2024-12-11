// реализовать получения фотки из AWS и данных из БД

import { config } from "../../config.js";

export const profileCommand = (ctx) => {
    ctx.reply(
        '*Ваш профиль 🤷‍♂️*',
        {
            parse_mode: 'MarkdownV2',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Профиль',
                        web_app: { url: config.webAppUrlProfile || '' }
                    }],
                ],
            },
        },   
    );
}