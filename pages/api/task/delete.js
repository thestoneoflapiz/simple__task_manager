import { getAuthUser } from "@/helpers/auth";
import { connectToDatabase } from "@/helpers/db";
import { BSON } from "mongodb";

async function handler(req, res){
  if(req.method !== "POST"){
    return;
  }

  const data = JSON.parse(req.body);
  const { _id  } = data;
  if(!_id){
    res.status(422).json({
      message: "Please fill in required fields..."
    });

    return;
  }

  const client = await connectToDatabase();
  const db = client.db();
  const authUser = await getAuthUser(req);

  try {
    

    const nid = new BSON.ObjectId(_id);
    const task = await db.collection("tasks").updateOne({ _id: nid}, {
      $set: {
        deleted_at: new Date(),
        deleted_by: authUser.username || "!!ERR"
      }
    })

    client.close();
    res.status(201).json({
      message: "Task deleted!"
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