import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongod = MongoMemoryServer.create();

class MongoInMemoryDatabase {
    async connect() {
        const uri = (await mongod).getUri();
        await mongoose.connect(uri);
    }

    async disconnect() {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        await mongoose.connection.close();
        await (await mongod).stop();
    }

    async clear() {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}

/** DB to be used while writing tests. */
export const inMemoryMongoDB = new MongoInMemoryDatabase();
