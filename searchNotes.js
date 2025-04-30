const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function searchNotes() {
  try {
    await client.connect();
    const db = client.db("noteapp");
    const notes = db.collection("notes");

    const searchResult = await notes.find({ $text: { $search: "работа" } }).toArray();
    
    console.log("Намерени бележки с таг 'работа':");
    console.log(searchResult);
  } catch (err) {
    console.error("Грешка:", err);
  } finally {
    await client.close();
  }
}

searchNotes();
