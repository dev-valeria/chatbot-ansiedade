require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    console.log("Recebendo uma mensagem...");
    const receivedMessage = req.body.Body.toLowerCase();
    const from = req.body.From;
    console.log("Mensagem recebida:", receivedMessage);

    let responseMessage;

    if (receivedMessage.includes("triste") || receivedMessage.includes("deprimido")) {
        responseMessage = "Sinto muito que você esteja se sentindo assim. Já tentou anotar o que está causando esses sentimentos? Pode ser um bom ponto de partida para explorar na terapia.";
    } else if (receivedMessage.includes("ansioso") || receivedMessage.includes("nervoso")) {
        responseMessage = "A ansiedade pode ser difícil de lidar. Uma sugestão é respirar fundo e tentar identificar o que está gerando esse nervosismo. Anote esses gatilhos para discutir na sua próxima sessão de terapia.";
    } else if (receivedMessage.includes("feliz") || receivedMessage.includes("alegre")) {
        responseMessage = "Que bom saber que você está se sentindo bem! Refletir sobre o que trouxe esses sentimentos positivos pode ajudar a cultivá-los mais vezes.";
    } else if (receivedMessage.includes("medo") || receivedMessage.includes("inseguro")) {
        responseMessage = "Sentir medo ou insegurança é natural. Pode ajudar listar os pensamentos que geram essa sensação e avaliar se são realistas. Talvez você queira discutir isso com seu terapeuta.";
    } else {
        responseMessage = "Obrigado por compartilhar. Que tal refletir um pouco sobre esses sentimentos e levar alguns pontos para a terapia? Estar ciente de suas emoções é o primeiro passo.";
    }

    console.log("Resposta enviada:", responseMessage);

    client.messages.create({
        body: responseMessage,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: from
    })
    // .then(message => {
    //     console.log(`Mensagem enviada: ${message.sid}`);
    //     res.sendStatus(200);  
    // })
    .catch(err => {
        console.error("Erro ao enviar mensagem para o Twilio:", err);
        res.status(500).send("Erro ao processar a mensagem");  
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});













