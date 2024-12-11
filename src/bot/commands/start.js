import { getUser, getUserWithRole }  from '../../db/checkUserOnStart.js';
import { MongoClient } from "mongodb";
import { config } from "../../config.js";

export const startCommand = async (ctx) => {

    let user = await getUser(ctx.from.id);
    console.log(user);
    if (user?.role === "USER") {
        // Вывод меню для обычных пользователей
        ctx.reply("Привет...")
    } else if (user?.role === "ADMIN") {
        // Вывод меню для админов
        ctx.reply("Привет админ...")
    } else if (user?.role === "EHOST") {
        // Вывод меню для ведущего
        ctx.reply("Привет ведущий...")
    } else {
        const text = ctx.message.text;
        const param = text.split(' ')[1];

        if (param) {
            console.log(param);
            if (param === "felixeventhost") {
                let user = await getUserWithRole("EHOST");
                if (!user) {
                    const client = new MongoClient(config.MONGO_CLIENT);
                    await client.connect();
                    const db = client.db("kaznax");
                    const users = db.collection("users");

                    let full_name = ""
                    if (ctx.from.first_name) {
                        full_name += ctx.from.first_name
                    }
                    if (ctx.from.last_name) {
                        full_name += ` ${ctx.from.last_name}`
                    }

                    // Добавление нового пользователя
                    const newUser = {
                        telegram_id: ctx.from.id,
                        username: ctx.from.username || null,
                        photo_url: null,
                        full_name: full_name || null,
                        role: "EHOST",
                        registered: false,
                        created: new Date(),
                    };
                    await users.insertOne(newUser);
                    ctx.reply("Привет ведущий...")
                } else {
                    ctx.reply("Ты не ведущий!")
                }
            }
        } else {
            console.log('Пользователя нет в бд');
            ctx.reply(
                '*Привет 🙋‍♂️*\nЭто пилотный проект проведения мероприятий, будете нашими подопытными 🤝\nДизайн простой, немного с юмором, попробуйте зарегестрироваться 😁\n\n_Из\\-за того, что мы решили никаким образом не сжимать файлы, то они могу подгружаться немного больше обычного_',
                {
                    parse_mode: 'MarkdownV2',
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Открывай',
                                web_app: { url: process.env.WEB_APP_URL || '' }
                            }],
                        ],
                    },
                },   
            );
        }
    }
    
}