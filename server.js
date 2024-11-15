const express = require('express');
const app = express();
const port = 3001;

let messages = [];

app.use(express.static(__dirname + '/public'));

app.get('/messages', (req, res) => {
    const sinceId = parseInt(req.query.since || 0, 10);

    // Long polling
    let checkMessages = () => {
        const newMessages = messages.filter(msg => msg.id > sinceId);
        if (newMessages.length > 0) {
            clearTimeout(timeout);
            res.json(newMessages);
        } else {
            timeout = setTimeout(checkMessages, 200); // Check every 200ms
        }
    };
    
    let timeout = setTimeout(checkMessages, 200);
});

app.post('/messages', express.urlencoded({ extended: true }), (req, res) => {
    const message = { id: messages.length + 1, text: req.body.text };
    messages.push(message);
    res.json(message);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});