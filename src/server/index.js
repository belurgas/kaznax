import express from 'express';
import bodyParser from "body-parser";
import { config } from '../config.js';
import { bot } from '../bot/index.js';

const app = express();
app.use(bodyParser.json());

app.post("/receive-data", async (req, res) => {
    const { userId, message } = req.body;
    try {
        if (message === "registered") {

            await bot.telegram.sendMessage(userId, "Поздравляю\\! Вы зарегестрированы 😊\nЗаходите в /profile ⬅️ если захотите что\\-нибудь изменить", {
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Жми",
                                callback_data: "next_after_reg",
                            }
                        ]
                    ]
                },
            });  
        } else if (message === "edited") {
            await bot.telegram.sendMessage(userId, "_*Данные изменены*_", {
                parse_mode: "MarkdownV2",
            });  
        }else {
            await bot.telegram.sendMessage(userId, "Что-то другое"); 
        }
        
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
})

export default function startServer() {
    const PORT = config.serverPort;
    app.listen(PORT, () => {
        console.log(`Сервер запущена на ${PORT}`);
    });
}