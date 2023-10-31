const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());


const conversionHistory = [];


app.get('/get-history', (req, res) => {
  res.json(conversionHistory);
});

app.post('/add-conversion', (req, res) => {
  const { fromCurrency, toCurrency, amount, result, date } = req.body;

  if (fromCurrency && toCurrency && amount && result && date) {
    const newConversion = { fromCurrency, toCurrency, amount, result, date };
    conversionHistory.push(newConversion);
    res.json({ message: 'Conversión registrada con éxito' });
  } else {
    res.status(400).json({ message: 'Solicitud incorrecta, faltan datos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de historial de conversiones escuchando en el puerto ${port}`);
});
