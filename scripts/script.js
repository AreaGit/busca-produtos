document.addEventListener("DOMContentLoaded", function () {
    const inputPesquisa = document.getElementById("pesquisaprod");
    const botaoPesquisar = document.getElementById("btnPesquisar");
    const resultadoDiv = document.getElementById("infoProd");
    const nomeProdutoSpan = document.getElementById("nomeProduto");

    inputPesquisa.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita comportamento padrão do formulário
            botaoPesquisar.click();
        }
    });

    botaoPesquisar.addEventListener("click", async function () {
        const nomeProduto = inputPesquisa.value.trim();
        if (!nomeProduto) {
            alert("Digite um nome de produto para pesquisar!");
            return;
        }

        resultadoDiv.innerHTML = "<p>🔍 Buscando produto...</p>";

        try {
            // Tenta buscar o produto exato
            const response = await fetch(`/buscar-produto?nome=${encodeURIComponent(nomeProduto)}`);
            if (response.ok) {
                const produto = await response.json();
                exibirProduto(produto);
            } else {
                // Se não encontrar, busca sugestões
                resultadoDiv.innerHTML = "<p>❌ Produto não encontrado. Buscando sugestões...</p>";
                buscarSugestoes(nomeProduto);
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            resultadoDiv.innerHTML = "<p>⚠️ Erro ao buscar produto.</p>";
        }
    });

    async function buscarSugestoes(nomeProduto) {
        try {
            const response = await fetch(`/sugerir-produtos?nome=${encodeURIComponent(nomeProduto)}`);
            if (response.ok) {
                const { sugestoes } = await response.json();
                exibirSugestoes(sugestoes);
            } else {
                resultadoDiv.innerHTML = "<p>❌ Nenhuma sugestão encontrada.</p>";
            }
        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
            resultadoDiv.innerHTML = "<p>⚠️ Erro ao buscar sugestões.</p>";
        }
    }

    function exibirSugestoes(sugestoes) {
        resultadoDiv.innerHTML = "<p>🔎 Sugestões de produtos:</p>";
        const lista = document.createElement("ul");

        sugestoes.forEach(nome => {
            const item = document.createElement("li");
            item.textContent = nome;
            item.style.cursor = "pointer";
            item.addEventListener("click", () => buscarProdutoSelecionado(nome));
            lista.appendChild(item);
        });

        resultadoDiv.appendChild(lista);
    }

    async function buscarProdutoSelecionado(nome) {
        resultadoDiv.innerHTML = "<p>🔍 Buscando informações do produto...</p>";
        try {
            const response = await fetch(`/buscar-produto?nome=${encodeURIComponent(nome)}`);
            if (response.ok) {
                const produto = await response.json();
                exibirProduto(produto);
            } else {
                resultadoDiv.innerHTML = "<p>❌ Produto não encontrado.</p>";
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            resultadoDiv.innerHTML = "<p>⚠️ Erro ao buscar produto.</p>";
        }
    }

    function exibirProduto(produto) {
        nomeProdutoSpan.textContent = produto.nome;
        resultadoDiv.innerHTML = `
            <p><strong>EAN:</strong> ${produto.ean || "N/A"}</p>
            <p><strong>Cor:</strong> ${produto.cor || "N/A"}</p>
            <p><strong>Estoque:</strong> ${produto.estoque || "N/A"}</p>
            <p><strong>Preço Clássico:</strong> R$ ${produto.preco_classico || "N/A"}</p>
            <p><strong>Preço Premium:</strong> R$ ${produto.preco_premium || "N/A"}</p>
            <p><strong>SKU:</strong> ${produto.sku || "N/A"}</p>
            <p><strong>Descrição:</strong> ${produto.descricao || "N/A"}</p>
            <p><strong>Marca:</strong> ${produto.marca || "N/A"}</p>
            <p><strong>Modelo:</strong> ${produto.modelo || "N/A"}</p>
            <p><strong>Dimensões:</strong> ${produto.altura || "N/A"} x ${produto.comprimento || "N/A"} x ${produto.largura || "N/A"}</p>
            <p><strong>Tempo de Produção:</strong> ${produto.tempo_producao || "N/A"} dias</p>
            <p><strong>Categoria:</strong> ${produto.categoria || "N/A"}</p>
            <p><strong>Vídeo:</strong> <a href="${produto.link_youtube}" target="_blank">Assistir</a></p>
            ${produto.fotos ? `<img src="${produto.fotos}" alt="Imagem do produto" style="max-width: 200px;">` : ""}
        `;
    }
});