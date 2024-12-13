import dotenv from "dotenv";
dotenv.config();

export const config = {
    botToken: process.env.BOT_TOKEN || "",
    webAppUrlAdmin: process.env.WEB_APP_URL_ADMIN || "",

    MONGO_CLIENT: process.env.MONGO_CLIENT || "",

    webAppUrl: process.env.WEB_APP_URL || "",
    webAppUrlProfile: process.env.WEB_APP_URL_PROFILE || "",
    webAppUrlActive: process.env.WEB_APP_URL_ACTIVE || "",

    serverPort: process.env.SERVER_PORT || 7384,
    aws: {
        accesKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        region: process.env.AWS_REGION || "",
        endpoint: process.env.AWS_ENDPOINT || "",
    },
};