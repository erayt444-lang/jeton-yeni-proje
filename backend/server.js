const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const VERI_DOSYASI = path.join(__dirname, 'ilanlar.json');

app.use(cors());
app.use(express.json());

function ilanlariOku() {
  if (!fs.existsSync(VERI_DOSYASI)) {
    fs.writeFileSync(VERI_DOSYASI, '[]', 'utf8');
  }
  const hamVeri = fs.readFileSync(VERI_DOSYASI, 'utf8');
  return JSON.parse(hamVeri || '[]');
}

function ilanlariYaz(veri) {
  fs.writeFileSync(VERI_DOSYASI, JSON.stringify(veri, null, 2), 'utf8');
}

app.get('/', (req, res) => {
  res.json({ mesaj: 'JETON arka plan sunucusu çalışıyor.' });
});

app.get('/api/ilanlar', (req, res) => {
  const ilanlar = ilanlariOku();
  res.json(ilanlar);
});

app.post('/api/ilanlar', (req, res) => {
  const ilanlar = ilanlariOku();
  const yeniIlan = {
    id: Date.now(),
    baslik: req.body.baslik,
    fiyat: req.body.fiyat,
    kategori: req.body.kategori || 'Genel'
  };
  ilanlar.push(yeniIlan);
  ilanlariYaz(ilanlar);
  res.status(201).json(yeniIlan);
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
app.delete('/api/ilanlar/:id', (req, res) => {
  const id = Number(req.params.id);
  const ilanlar = ilanlariOku();
  const kalanlar = ilanlar.filter(item => Number(item.id) !== id);

  if (kalanlar.length === ilanlar.length) {
    return res.status(404).json({ mesaj: 'İlan bulunamadı' });
  }

  ilanlariYaz(kalanlar);
  res.json({ mesaj: 'İlan silindi', id });
});