import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IncomingForm } from "formidable";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs/promises';

// ВСЁ ВЗАИМОДЕЙСТВИЕ С ДАННЫМИ В ЕДИНЧНМО И ЛИЧНОМ ФОРМАТЕ ПРОИСХОДЯТ ТУТ!

export const config = {
    api: {
      bodyParser: false, // Отключаем встроенный парсер Next.js
    },
  };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const S3_BUCKET = "8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5";
    const REGION = "ru-1";
    const S3_ENDPOINT = "https://s3.timeweb.cloud";
    const S3_ACCESS_KEY = "MP0LICYBVQ8KW0ES89JV";
    const S3_SECRET_KEY = "bY4DBkwHVdvA8j6l3IVlwwq0p35z0T2NIiV0rHl2";


    if (req.method !== "POST") {
        return res.status(405).json({error: "Я ФОНАТ ГОВНА"})
    }

    const addUserCard = async (telegram_id: number, photo_url: string) => {
        console.log(process.env.MONGODB_URI)
        const client = new MongoClient("mongodb://127.0.0.1:27017/");
        await client.connect();
        const db = client.db("kaznax");
        const users = db.collection("usersCard");

        const existingUser = await users.findOne({ telegram_id });

        if (existingUser) {
            // Обновление существующего пользователя
            await users.updateOne({ telegram_id }, { $set: { photo_url } });
            console.log("Обновлили пользователя карту")
        } else {
            // Добавление нового пользователя
            const newUser = {
                telegram_id,
                photo_url,
                full_name,
                who_voite: [],
                voite_for: null,
                win: false,
                created: new Date(),
            };
            await users.insertOne(newUser); 
            console.log("Добавили пользователя карту")
        }
    }

    const form = new IncomingForm();
    console.log(req.body);

    try {
        const { fields, files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
          });
        });
        
        const data = JSON.parse(fields.jsonData[0]);
        console.log(data.telegram_id)

        const fileValue = files[data.telegram_id as string][0];

        let s3PhotoUrl: string = "https://s3.timeweb.cloud/8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5/";

        if (fileValue) {
            const filePath = fileValue.filepath;
            // Чтение содержимого файла и преобразование в Buffer
            const fileBuffer = await fs.readFile(filePath); // Чтение содержимого файла в Buffer
      
            // Теперь у вас есть файл в виде Buffer
            // Например, если нужно загрузить файл в S3:
            const s3Client = new S3Client({
              region: REGION,
              endpoint: S3_ENDPOINT,
              credentials: {
                accessKeyId: S3_ACCESS_KEY,
                secretAccessKey: S3_SECRET_KEY,
              },
            });
      
            const command = new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: `${data.telegram_id}_card.png`,
              Body: fileBuffer, // Отправляем Buffer
              ContentType: fileValue.mimetype,
            });
            
            await s3Client.send(command);
            s3PhotoUrl += `${data.telegram_id}_card.png`;
            console.log("Файл успешно загружен в S3");

            await addUserCard(data.telegram_id, s3PhotoUrl);
            (res.socket as any).server.io?.emit("add_card", data.telegram_id)
          }
    
        res.status(200).json({ message: 'Форма успешно обработана', fields, files });
      } catch (error) {
        console.error('Ошибка обработки формы:', error);
        res.status(500).json({ error: 'Ошибка обработки данных' });
      }


    // try {
    //     const { telegram_id, message, type, photo_url } = req.body;
    //     console.log(req.body)

    //     if (type === "add_card") {
    //         await addUserCard(telegram_id, photo_url);
    //         (res.socket as any).server.io?.emit("add_card", telegram_id)
    //     }

    //     if (message) {
    //         (res.socket as any).server.io?.emit("golos", message) 
    //     } else if (telegram_id) {
    //         (res.socket as any).server.io?.emit("golos", telegram_id) 
    //     } else {
    //         return res.status(400).json({error: "Нету блять сообщения"});
    //     }

        

    //     return res.status(200).json({message: req.body});
    // } catch (error) {
    //     console.log("[MESSAGE_PSOT] ОШИБКА БЛОКА TRY");
    //     return res.status(500).json({message: "Internal error"})
    // }
}