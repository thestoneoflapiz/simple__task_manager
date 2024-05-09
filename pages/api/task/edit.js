import { getAuthUser } from "@/helpers/auth";
import { connectToDatabase } from "@/helpers/db";
import { BSON } from "mongodb";

async function handler(req, res){
  if(req.method !== "POST"){
    return;
  }

  const data = JSON.parse(req.body);
  const { task_id, type_id, title, description, assigned } = data;
  if(!task_id || !type_id || !title || !description || !assigned){
    res.status(422).json({
      message: "Please fill in required fields..."
    });

    return;
  }

  const client = await connectToDatabase();
  const db = client.db();
  const authUser = await getAuthUser(req);

  try {
    const total = await db.collection("tasks").countDocuments({
      "type_id": {
        "$eq": type_id
      },
      "deleted_at": {
        "$exists": false,
      }
    });

    const nid = new BSON.ObjectId(task_id);
    const task = await db.collection("tasks").updateOne({ _id: nid}, {
      "$set": {
        type_id: parseInt(type_id),
        title,
        description,
        assigned: new BSON.ObjectId(assigned),
        order: total+1,
        updated_at: new Date(),
        updated_by: authUser?.name || (authUser?.name || "!!ERR")
      }
    });

    client.close();
    res.status(201).json({
      message: "Task saved!"
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