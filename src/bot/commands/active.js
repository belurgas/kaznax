import { config } from "../../config.js";

export const activeComa = (ctx) => {
    ctx.reply(
        '*Активность*',
        {
            parse_mode: 'MarkdownV2',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Профиль',
                        web_app: { url: config.webAppUrlActive || '' }
                    }],
                ],
            },
        },   
    );
}