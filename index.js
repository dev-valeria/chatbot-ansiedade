require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Chatbot de Ansiedade está funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
