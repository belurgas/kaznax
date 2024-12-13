import { MongoClient } from "mongodb";
import { config } from "../config.js";

export async function getUser(telegram_id) {
    const client = new MongoClient(config.MONGO_CLIENT);
    await client.connect();
    const db = client.db("kaznax");
    const users = db.collection("users");

    const user = await users.findOne({ telegram_id, });
    return user;
}

export async function getUserWithRole(role) {
    const client = new MongoClient(config.MONGO_CLIENT);
    await client.connect();
    const db = client.db("kaznax");
    const users = db.collection("users");

    const user = await users.findOne({ role });
    return user;
}

export async function isAdmin(telegram_id) {
    const client = new MongoClient(config.MONGO_CLIENT);
    await client.connect();
    const db = client.db("kaznax");
    const users = db.collection("users");

    const user = await users.findOne({ telegram_id, role: "ADMIN" });
    return user;
}