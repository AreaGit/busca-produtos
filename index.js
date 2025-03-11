const express = require('express');
const app = express();
const port = 8008;
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const axios = require('axios');


app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Rota GET para busca de produtos
app.get('/buscar-produto', (req, res) => {
    const { nome } = req.query;
    
    console.log('🔍 Recebendo requisição para buscar produto:', nome);
    
    if (!nome) {
        console.log('⚠️ Erro: Nome do produto não informado.');
        return res.status(400).json({ erro: 'Informe um nome de produto.' });
    }

    // Carregar a planilha e converter para JSON
    console.log('📂 Carregando planilha...');
    const workbook = xlsx.readFile('PRODUTOS AREA PROMOCIONAL.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const produtos = xlsx.utils.sheet_to_json(sheet);
    console.log(`📊 ${produtos.length} produtos carregados da planilha.`);

    const nomeFormatado = nome.trim().toLowerCase();
    console.log('🔎 Buscando produto com nome formatado:', nomeFormatado);

    // Buscar o produto na coluna correta (__EMPTY)
    const produtoEncontrado = produtos.find(produto => {
        if (produto.__EMPTY) {
            const nomeProdutoPlanilha = produto.__EMPTY.toString().trim().toLowerCase();
            console.log(`🧐 Comparando: "${nomeProdutoPlanilha}" com "${nomeFormatado}"`);
            return nomeProdutoPlanilha === nomeFormatado;
        }
        return false;
    });

    if (!produtoEncontrado) {
        console.log('❌ Produto não encontrado:', nomeFormatado);
        return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    console.log('✅ Produto encontrado:', produtoEncontrado);

    // Retornar os dados formatados corretamente
    const resposta = {
        nome: produtoEncontrado.__EMPTY,
        ean: produtoEncontrado.__EMPTY_1,
        cor: produtoEncontrado.__EMPTY_2,
        estoque: produtoEncontrado.__EMPTY_3,
        preco_classico: produtoEncontrado.__EMPTY_4,
        preco_premium: produtoEncontrado.__EMPTY_5,
        sku: produtoEncontrado.__EMPTY_6,
        descricao: produtoEncontrado['TODOS NOSSOS PRODUTOS'],
        link_youtube: produtoEncontrado.__EMPTY_7,
        marca: produtoEncontrado.__EMPTY_8,
        modelo: produtoEncontrado.__EMPTY_9,
        altura: produtoEncontrado.__EMPTY_10,
        comprimento: produtoEncontrado.__EMPTY_11,
        largura: produtoEncontrado.__EMPTY_12,
        cauda_longa_1: produtoEncontrado.__EMPTY_13,
        cauda_longa_2: produtoEncontrado.__EMPTY_14,
        tempo_producao: produtoEncontrado.__EMPTY_15,
        fotos: produtoEncontrado.__EMPTY_16,
        categoria: produtoEncontrado.__EMPTY_17,
    };

    console.log('📦 Resposta enviada ao cliente:', resposta);
    res.json(resposta);
});

//Rota GET para sugestões de produtos
app.get('/sugerir-produtos', (req, res) => {
    const { nome } = req.query;

    console.log('🔍 Buscando sugestões para:', nome);

    if (!nome) {
        console.log('⚠️ Erro: Nome do produto não informado.');
        return res.status(400).json({ erro: 'Informe um nome de produto.' });
    }

    // Carregar a planilha e converter para JSON
    console.log('📂 Carregando planilha...');
    const workbook = xlsx.readFile('PRODUTOS AREA PROMOCIONAL.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const produtos = xlsx.utils.sheet_to_json(sheet);
    console.log(`📊 ${produtos.length} produtos carregados.`);

    const nomeFormatado = nome.trim().toLowerCase();
    console.log('🔎 Nome formatado para busca:', nomeFormatado);

    // Buscar produtos semelhantes
    const produtosEncontrados = produtos.filter(produto => 
        produto.__EMPTY && produto.__EMPTY.toString().toLowerCase().includes(nomeFormatado)
    );

    console.log(`🧐 ${produtosEncontrados.length} sugestões encontradas.`);

    if (produtosEncontrados.length === 0) {
        console.log('❌ Nenhuma sugestão encontrada.');
        return res.status(404).json({ erro: 'Nenhuma sugestão encontrada.' });
    }

    // Retorna apenas os nomes como sugestões
    const sugestoes = produtosEncontrados.map(produto => produto.__EMPTY);
    console.log('🔄 Sugestões enviadas:', sugestoes);
    res.json({ sugestoes });
});

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}, http://localhost:${port}`);
});
