require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Създаваме модел за бележка
const noteSchema = new mongoose.Schema({
  title: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Свързваме се към MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ Error connecting to MongoDB Atlas:', err));

// 1️⃣ Добавяне на бележка
app.post("/add-note", async (req, res) => {
  try {
    const { title, tags } = req.body;

    const newNote = new Note({
      title,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await newNote.save();
    res.status(201).json({ message: "Бележката е добавена!", id: result._id });
  } catch (err) {
    res.status(500).json({ message: "Грешка при добавянето на бележка", error: err });
  }
});

// 2️⃣ Извличане на всички бележки
app.get("/get-notes", async (req, res) => {
  try {
    console.log("Извършва се заявка за извличане на бележки...");
    const allNotes = await Note.find();
    
    if (allNotes.length === 0) {
      console.log("Няма намерени бележки.");
    }

    res.status(200).json(allNotes);
  } catch (err) {
    console.error("Грешка при извличането на бележките:", err);
    res.status(500).json({ message: "Грешка при извличането на бележките", error: err });
  }
});

// 3️⃣ Търсене по текст
app.get("/search-notes", async (req, res) => {
  try {
    const searchQuery = req.query.text;

    if (!searchQuery) {
      return res.status(400).json({ message: "Липсва параметър 'text'" });
    }

    const result = await Note.find({ $text: { $search: searchQuery } });

    res.status(200).json(result);
  } catch (err) {
    console.error("Грешка при търсенето:", err); // За по-добра диагностика
    res.status(500).json({
      message: "Грешка при търсенето на бележки",
      error: err.message || "Неизвестна грешка"
    });
  }
});

// 4️⃣ Филтриране по тагове
app.get("/filter-by-tags", async (req, res) => {
  try {
    const tags = req.query.tags.split(","); // Очаква параметър "tags" "покупки,работа"

    const filterResult = await Note.find({ tags: { $all: tags } });
    res.status(200).json(filterResult);
  } catch (err) {
    res.status(500).json({ message: "Грешка при филтрирането на бележки", error: err });
  }
});

// 5️⃣ Филтриране по дата
app.get("/filter-by-date", async (req, res) => {
  try {
    const dateLimit = new Date(req.query.date); // Очаква параметър "date", например: "2024-01-01"

    // Проверка дали датата е валидна
    if (isNaN(dateLimit)) {
      return res.status(400).json({ message: "Невалидна дата" });
    }

    const dateResult = await Note.find({ createdAt: { $gte: dateLimit } });
    res.status(200).json(dateResult);
  } catch (err) {
    res.status(500).json({ message: "Грешка при филтрирането на бележки по дата", error: err });
  }
});

// Старт на сървъра
app.listen(port, () => {
  console.log(`Сървърът работи на http://localhost:${port}`);
});
