const express = require('express');
const app = express();
const path = require('path');

// Define o diretório de arquivos estáticos (por exemplo, HTML, CSS, imagens)
app.use('/static', express.static(path.join(__dirname, 'static')));

// Define uma rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'html', 'index.html'));
});

// Inicia o servidor na porta 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});