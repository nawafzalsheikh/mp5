import { MongoClient, MongoServerError } from "mongodb";

type Link = { _id: string; url: string };

let client: MongoClient;

function getLinks() {
  if (!client) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is missing.");
    }
    client = new MongoClient(uri);
  }
  return client.db("url_shortener").collection<Link>("links");
}

export async function createLink(alias: string, url: string) {
  try {
    //mongoDB gives each _id one document, so two links cannot share an alias
    await getLinks().insertOne({ _id: alias, url });
    return true;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return false;
    }
    throw error;
  }
}

export async function findLink(alias: string) {
  return getLinks().findOne({ _id: alias });
}
