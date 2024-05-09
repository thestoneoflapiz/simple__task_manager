import { connectToDatabase } from "@/helpers/db";
import moment from "moment";

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
    const users = await db.collection("users").find().project({ _id:1, name: 1}).toArray();
    const tasks = await db.collection("tasks")
      .find(completeQuery)
      .sort({
        order: 1
      })
      .toArray();

    client.close();
    res.status(201).json({
      list: tasks.map((item)=>{
        const dateFormatC = moment(item.created_at).format("YYYY-MM-DD");
        item.created = {
          by: item.created_by,
          date: dateFormatC
        }

        item.assignee = users.find(u=>u._id.equals(item.assigned));
        return item;
      }),
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