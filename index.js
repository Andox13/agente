const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/crear-pdf', (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'Falta el nombre' });
    }

    const doc = new PDFDocument();
    const filename = `documento-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, 'pdfs', filename);

    // Asegúrate que la carpeta 'pdfs' exista
    if (!fs.existsSync('./pdfs')) {
        fs.mkdirSync('./pdfs');
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(25).text(`Hola, ${nombre}`, 100, 100);
    doc.end();

    stream.on('finish', () => {
        res.status(200).json({ mensaje: 'PDF creado', archivo: filename });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
