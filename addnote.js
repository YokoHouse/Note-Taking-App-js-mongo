const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function addNote() {
  try {
    await client.connect();
    const db = client.db("noteapp");
    const notes = db.collection("notes");

    const newNote = {
      title: "Нова бележка за работа",
      tags: ["работа", "покупки"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await notes.insertOne(newNote);
    console.log("Бележката е добавена с ID:", result.insertedId);
  } catch (err) {
    console.error("Грешка:", err);
  } finally {
    await client.close();
  }
}

addNote();
