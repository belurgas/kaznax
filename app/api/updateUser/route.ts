import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";


export async function POST(request: NextRequest) {
    const S3_BUCKET = "8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5";
    const REGION = "ru-1";
    const S3_ENDPOINT = "https://s3.timeweb.cloud";
    const S3_ACCESS_KEY = "MP0LICYBVQ8KW0ES89JV";
    const S3_SECRET_KEY = "bY4DBkwHVdvA8j6l3IVlwwq0p35z0T2NIiV0rHl2";
  
    try {
        const formData = await request.formData();
        const jsond = formData.get("jsonData") as string;
        const { telegram_id, username, full_name, role } = JSON.parse(jsond);
  
      // const uploadedFiles: string[] = [];
      let s3PhotoUrl: string = "";
  
      // Обработка всех файлов в formData
      for (const [name, value] of formData.entries()) {
        if (value instanceof Blob) {
          const file = value as Blob;
  
          // Получаем оригинальное имя файла и его MIME-тип
          const mimeType = file.type || "application/octet-stream";
          // const ext = mime.getExtension(mimeType) || "bin";
          // const fileName = `${name}_photo.${ext}`;
          const fileName = `${name}_photo.png`;
  
          // const filePath = join(uploadDir, fileName);
          const buffer = Buffer.from(await file.arrayBuffer());
  
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
          s3PhotoUrl = `${S3_ENDPOINT}/${S3_BUCKET}/${fileName}`;
  
          // Сохраняем файл
          // await writeFile(filePath, buffer);
          console.log(s3PhotoUrl);
          // Добавляем путь к файлу в массив
          // uploadedFiles.push(`${relativeUploadDir}/${fileName}`);
        }
      }

        // Подключение к MongoDB
        const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
        await client.connect();
        const db = client.db("kaznax");
        const users = db.collection("users");

        // Проверка наличия пользователя
        const existingUser = await users.findOne({ telegram_id });

        if (existingUser) {
            // Обновление данных пользователя
            const result = await users.updateOne(
              { telegram_id },
              { $set: { photo_url: s3PhotoUrl, full_name } }
            );
      
            if (result.matchedCount === 0) {
              return NextResponse.json(
                { error: "Пользователь с таким telegram_id не найден." },
                { status: 404 }
              );
            }
      
            return NextResponse.json(
                { files: s3PhotoUrl },
              { status: 200 }
            );
        }

        // Добавление нового пользователя
        const newUser = {
            telegram_id,
            username: username || null,
            photo_url: s3PhotoUrl,
            full_name: full_name || null,
            role: role || "USER",
            registered: true,
            created: new Date(),
        };
        await users.insertOne(newUser);
  
        return NextResponse.json(
            { files: s3PhotoUrl },
            { status: 201 }
        );
    } catch (error) {
      console.error("Ошибка при обработке загрузки файла:", error);
      return NextResponse.json(
        { error: "Ошибка на сервере." },
        { status: 500 }
      );
    }
  }

export async function PATCH(request: NextRequest) {
  const S3_BUCKET = "8f8b2e5c-7d3d88b1-cdba-428e-a439-080dc0a97ec5";
  const REGION = "ru-1";
  const S3_ENDPOINT = "https://s3.timeweb.cloud";
  const S3_ACCESS_KEY = "MP0LICYBVQ8KW0ES89JV";
  const S3_SECRET_KEY = "bY4DBkwHVdvA8j6l3IVlwwq0p35z0T2NIiV0rHl2";

  try {
    const body = await request.json();
    const { telegram_id, username, photo_url, full_name, role } = body;

    if (!telegram_id || !photo_url) {
      return NextResponse.json(
        { error: "Поля telegram_id и photo_url обязательны." },
        { status: 400 }
      );
    }

    // Подключение к MongoDB
    const client = new MongoClient("mongodb://gen_user:N%3Eyp10S6%5C%24%5Ca%5Cw@195.133.73.180:27017/default_db?authSource=admin&directConnection=true");
    await client.connect();
    const db = client.db("kaznax");
    const users = db.collection("users");

    // Проверка наличия пользователя
    const existingUser = await users.findOne({ telegram_id });

    // Загрузка фотографии из URL
    const photoResponse = await axios.get(photo_url, { responseType: "arraybuffer" });
    const photoBuffer = Buffer.from(photoResponse.data);

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

    if (existingUser) {
      // Обновление данных пользователя
      const result = await users.updateOne(
        { telegram_id },
        { $set: { photo_url: s3PhotoUrl, full_name } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Пользователь с таким telegram_id не найден." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Данные обновлены." },
        { status: 200 }
      );
    }

    // Добавление нового пользователя
    const newUser = {
      telegram_id,
      username: username || null,
      photo_url: s3PhotoUrl,
      full_name: full_name || null,
      role: role || "USER",
      registered: true,
      created: new Date(),
    };
    await users.insertOne(newUser);

    return NextResponse.json(
      { success: true, message: "Пользователь добавлен." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { error: "Ошибка на сервере." },
      { status: 500 }
    );
  }
}
