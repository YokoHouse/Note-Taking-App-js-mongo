const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("noteapp"); 
    const notes = db.collection("notes"); 

    const result = await notes.find({ tags: "спорт" }).toArray();
    console.log("Бележки с таг 'спорт':", result);
  } catch (err) {
    console.error("Грешка:", err);
  } finally {
    await client.close();
  }
}

run();
