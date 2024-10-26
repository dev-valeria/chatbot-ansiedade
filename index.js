require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const receivedMessage = req.body.Body;
    const from = req.body.From;

    // Lógica inicial para responder à ansiedade
    let responseMessage = "Entendo que você está ansioso. Respire fundo, conte até três e compartilhe mais sobre o que está sentindo. Estou aqui para ouvir.";

    client.messages.create({
        body: responseMessage,
        from: `whatsapp:+14155238886`,
        to: from
    })
    .then(message => {
        console.log(`Mensagem enviada: ${message.sid}`);
        // Enviar uma resposta ao Twilio para confirmar que o webhook foi processado
        res.sendStatus(200);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Erro ao enviar a mensagem');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
