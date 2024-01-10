const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = 3000;
let pdfPath = '';

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('form');
});


app.post('/submit', async (req, res) => {
  const { name, password, email, phone } = req.body;
  pdfPath = path.join(__dirname, 'output.pdf');

  // Create a PDF with the submitted form data
  await generatePDF({ name, password, email, phone }, pdfPath);

  // Send a link to the generated PDF with target="_blank"
  res.send(`Form submitted successfully! <a href=${pdfPath} target="_blank">Download PDF</a>`);
});

// Add a route to handle PDF download
app.get('/download', (req, res) => {
  res.download(pdfPath, 'output.pdf');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function generatePDF(formData, pdfPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const ejsTemplate = path.join(__dirname, 'views', 'template.ejs');
  const htmlContent = await ejs.renderFile(ejsTemplate, { formData });

  await page.setContent(htmlContent);
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();
}
