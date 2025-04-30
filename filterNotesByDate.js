const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function filterNotesByDate() {
  try {
    await client.connect();
    const db = client.db("noteapp");
    const notes = db.collection("notes");

    const dateLimit = new Date("2024-01-01T00:00:00Z");

    const dateResult = await notes.find({ createdAt: { $gte: dateLimit } }).toArray();
    
    console.log("Намерени бележки след 2024-01-01:");
    console.log(dateResult);
  } catch (err) {
    console.error("Грешка:", err);
  } finally {
    await client.close();
  }
}

filterNotesByDate();
