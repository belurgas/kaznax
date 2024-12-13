import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import sharp from "sharp";

const S3_BUCKET = "8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5";
const REGION = "ru-1";
const S3_ENDPOINT = "https://s3.timeweb.cloud";
const S3_ACCESS_KEY = "MP0LICYBVQ8KW0ES89JV";
const S3_SECRET_KEY = "bY4DBkwHVdvA8j6l3IVlwwq0p35z0T2NIiV0rHl2";

// Утилита для обработки изображений
async function processImage(file: any) {
  return sharp(file)
    .rotate()
    .jpeg({ quality: 70 })
    .toBuffer();
}

// Создание клиента S3
const s3Client = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  region: REGION,
  endpoint: S3_ENDPOINT,
  forcePathStyle: true,
});

const UpdateUser = async (telegram_id: number, full_name: string, s3PhotoUrl: string, username?: string) => {
  // Подключение к MongoDB
  const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
  await client.connect();
  const db = client.db("kaznax");
  const users = db.collection("users");

  users.updateOne(
    { telegram_id }, // Критерий поиска
    { $set: { photo_url: s3PhotoUrl, full_name },
      $setOnInsert: {
        telegram_id,
        username: username || null,
        role: "USER",
        registered: true,
        created: new Date(),
      } 
    }, // Данные для обновления
    { upsert: true } // Опция upsert
  );
}

export async function POST(request: NextRequest) {
    try {
      const formData = await request.formData();
      const jsond = formData.get("jsonData") as string;
      const { telegram_id, username, full_name } = JSON.parse(jsond);
      
      for (const [, value] of formData.entries()) {
        if (value instanceof Blob) {
          const file = value as Blob;

          const response = NextResponse.json(
            { message: "Фото обрабатывается в фоновом режиме" },
            { status: 200 }
          );

          // Получаем оригинальное имя файла и его MIME-тип
          const mimeType = file.type || "application/octet-stream";
          const fileName = `${telegram_id}_photo.jpg`;
          const buffer = await processImage(Buffer.from(await file.arrayBuffer()));

          // Загрузка файла в S3
          const uploadCommand = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: fileName,
            Body: buffer,
            ContentType: mimeType,
            ACL: "public-read", // Если файл должен быть доступен публично
          });
          await s3Client.send(uploadCommand);

          // Ссылка на загруженный файл
          const s3PhotoUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${fileName}`;

          await UpdateUser(telegram_id, full_name, s3PhotoUrl, username);

          return response;
        }
      }
    } catch (error) {
      console.error("Ошибка при обработке загрузки файла:", error);
      return NextResponse.json(
        { error: "Ошибка на сервере." },
        { status: 500 }
      );
    }
  }

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegram_id, username, photo_url, full_name } = body;

    if (!telegram_id || !photo_url) {
      return NextResponse.json(
        { error: "Поля telegram_id и photo_url обязательны." },
        { status: 400 }
      );
    }

    // Загрузка фотографии из URL
    const photoResponse = await axios.get(photo_url, { responseType: "arraybuffer" });
    const photoBuffer = await processImage(Buffer.from(photoResponse.data));

    // Загрузка файла в S3
    const fileName = `${telegram_id}_photo.png`;
    const uploadCommand = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: photoBuffer,
      ContentType: photoResponse.headers["content-type"],
      ACL: "public-read", // Если файл должен быть доступен публично
    });
    await s3Client.send(uploadCommand);

    // Ссылка на загруженный файл
    const s3PhotoUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${fileName}`;

    await UpdateUser(telegram_id, full_name, s3PhotoUrl, username);

    return NextResponse.json(
      { success: true, message: "Пользователь добавлен." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { error: "Ошибка на сервере." },
      { status: 500 }
    );
  }
}
