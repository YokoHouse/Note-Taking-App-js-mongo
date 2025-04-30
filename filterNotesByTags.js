const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function filterNotesByTags(tags) {
  try {
    await client.connect();
    const db = client.db("noteapp");
    const notes = db.collection("notes");

    // Филтриране на бележки по тагове
    const filterResult = await notes.find({ tags: { $all: tags } }).toArray();
    
    if (filterResult.length === 0) {
      console.log("Няма намерени бележки с тези тагове.");
    } else {
      console.log("Намерени бележки с тагове:", tags);
      console.log(filterResult);
    }
  } catch (err) {
    console.error("Грешка:", err);
  } finally {
    await client.close();
  }
}

// Пример за филтриране по тагове: "покупки" и "спорт"
const tagsToFilter = ["покупки", "спорт"];
filterNotesByTags(tagsToFilter);
