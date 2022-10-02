import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("cards");

      const cards = db.collection("cards-collection");

      const result = await cards.insertOne(req.body);
      res.json(result);
    } catch (e) {
      res.send({ error: e });
      console.error(e);
    }
  }
}
