const ExcelJS = require('exceljs');
const fs = require('fs');

async function testExcel() {
  const filePath = './veteran_contacts.xlsx';
  const workbook = new ExcelJS.Workbook();
  
  if (fs.existsSync(filePath)) {
    console.log('Excel file found, reading...');
    await workbook.xlsx.readFile(filePath);
  } else {
    console.log('No Excel file found, creating new one...');
    const sheet = workbook.addWorksheet('Contacts');
    sheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Purpose', key: 'purpose', width: 20 },
      { header: 'Time In', key: 'time_in', width: 10 },
      { header: 'Time Out', key: 'time_out', width: 10 },
      { header: 'Date', key: 'date', width: 15 }
    ];
  }

  const worksheet = workbook.getWorksheet('Contacts');
  worksheet.addRow({ name: 'John Doe', email: 'johndoe@example.com', phone: '123-456-7890', purpose: 'Test', time_in: '12:00', time_out: '12:30', date: '2025-05-02' });

  console.log('Writing to Excel file...');
  await workbook.xlsx.writeFile(filePath);
  console.log('Excel file written!');
}

testExcel();
