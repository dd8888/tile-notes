import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("cards");
      const cards = await db.collection("cards-collection").find({}).toArray();
      res.json(cards);
    } catch (e) {
      res.send({ error: e });
    }
  } else if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("cards");

      const cards = db.collection("cards-collection");
      const options = { upsert: false };
      const query = { _id: new ObjectId(req.body._id) };
      const { _id, ...rest } = req.body;
      const replacementDoc = {
        $set: {
          ...rest,
        },
      };
      const result = await cards.updateOne(query, replacementDoc, options);
      res.json(result);
    } catch (e) {
      res.send({ error: e });
      console.error(e);
    }
  }
}
