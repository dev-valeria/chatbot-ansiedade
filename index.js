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
    let followUpMessage = null;

    if (receivedMessage.includes("triste") || receivedMessage.includes("deprimido")) {
        responseMessage = "Sinto muito que você esteja se sentindo assim. Uma técnica útil pode ser respirar fundo por cinco segundos, segurar e soltar lentamente. Experimente focar na sua respiração.";
        followUpMessage = "Caso esteja confortável, você pode anotar o que está sentindo para explorar na próxima sessão de terapia.";

    } else if (receivedMessage.includes("ansioso") || receivedMessage.includes("nervoso")) {
        responseMessage = "Entendo que a ansiedade pode ser intensa. Tente a técnica de respiração 4-7-8: inspire por 4 segundos, segure por 7, e expire por 8. Pode ajudar a acalmar o sistema nervoso.";
        followUpMessage = "Talvez seja útil pensar em quais situações te causaram ansiedade hoje. Anotar essas situações pode ser um bom recurso para refletir mais tarde.";

    } else if (receivedMessage.includes("feliz") || receivedMessage.includes("alegre")) {
        responseMessage = "Fico feliz em saber que você está bem! Aproveite esse momento e pense no que fez você se sentir assim para tentar repetir mais vezes.";
        followUpMessage = "Refletir sobre as coisas que te trazem alegria pode ajudar a manter esses momentos presentes no dia a dia.";

    } else if (receivedMessage.includes("medo") || receivedMessage.includes("inseguro")) {
        responseMessage = "Sentir medo e insegurança é natural. Pode ser útil listar os pensamentos que trazem essa sensação e questionar se são reais ou imaginários.";
        followUpMessage = "Você pode pensar em quais atitudes pequenas poderiam te dar mais segurança? Compartilhar essas ideias com um terapeuta pode ajudar a ganhar clareza.";

    } else if (receivedMessage.includes("não estou bem")) {
        responseMessage = "Sinto muito que você não esteja se sentindo bem. Às vezes, só desabafar já ajuda um pouco.";
        followUpMessage = "Lembre-se de que é normal ter dias difíceis. Caso queira, posso sugerir alguma técnica de relaxamento.";

    } else {
        responseMessage = "Obrigado por compartilhar seus sentimentos. Se estiver confortável, reflita um pouco sobre o que está sentindo e leve esses pontos para a terapia.";
    }

    try {
        await client.messages.create({
            body: responseMessage,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: from
        });
        console.log("Resposta enviada:", responseMessage);

        if (followUpMessage) {
            setTimeout(async () => {
                await client.messages.create({
                    body: followUpMessage,
                    from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
                    to: from
                });
                console.log("Mensagem de acompanhamento enviada:", followUpMessage);
            }, 5000); 
        }
    } catch (err) {
        console.error("Erro ao enviar mensagem para o Twilio:", err);
        res.status(500).send("Erro ao processar a mensagem");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});














