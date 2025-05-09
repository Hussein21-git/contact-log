const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Create DB and table
const db = new sqlite3.Database('./contacts.db');
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      purpose TEXT,
      person_visiting TEXT,
      time_in TEXT,
      time_out TEXT,
      date TEXT
    )
  `);
});

// ✅ Save to Excel
async function saveToExcel(contact) {
  const filePath = path.join(__dirname, 'veteran_contacts.xlsx');
  const workbook = new ExcelJS.Workbook();

  let worksheet;

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet('Contacts');
  }

  if (!worksheet) {
    worksheet = workbook.addWorksheet('Contacts');
  }

  // ✅ Always set columns (overwrite or ensure headers are correct)
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Purpose', key: 'purpose', width: 20 },
    { header: 'Person Visiting', key: 'person_visiting', width: 25 },
    { header: 'Time In', key: 'time_in', width: 10 },
    { header: 'Time Out', key: 'time_out', width: 10 },
    { header: 'Date', key: 'date', width: 15 }
  ];

  worksheet.addRow(contact);

  await workbook.xlsx.writeFile(filePath);
  console.log('✅ Excel updated:', contact);
}


app.post('/contacts', (req, res) => {
  const { name, email, phone, purpose, person_visiting, time_in, time_out } = req.body;
  const date = new Date().toLocaleDateString();

  const contact = { name, email, phone, purpose, person_visiting, time_in, time_out, date };
  console.log('📥 Received contact:', contact);

  db.run(
    `INSERT INTO contacts (name, email, phone, purpose, person_visiting, time_in, time_out, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, purpose, person_visiting, time_in, time_out, date],
    async function (err) {
      if (err) {
        console.error('❌ DB Error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      try {
        await saveToExcel(contact);
        res.status(200).json({ message: 'Contact saved', id: this.lastID });
      } catch (excelErr) {
        console.error('❌ Excel Error:', excelErr);
        res.status(500).json({ message: 'Failed to save to Excel' });
      }
    }
  );
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contacts.html'));
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
