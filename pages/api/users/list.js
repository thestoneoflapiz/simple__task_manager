import { connectToDatabase } from "@/helpers/db";

async function handler(req, res){
  if(req.method !== "GET"){
    return;
  }

  const completeQuery = {
    "deleted_at": {
      "$exists": false,
    }
  }

  const client = await connectToDatabase();
  const db = client.db();
  
  try {
    const users = await db.collection("users")
      .find(completeQuery)
      .sort({
        created_at: 1
      })
      .toArray();

    client.close();
    res.status(201).json({
      list: users,
    });
  } catch (error) {
    client.close();
    res.status(422).json({
      message: "Something went wrong...",
      error
    });
  }

  return;
}

export default handler;