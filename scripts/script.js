/*document.addEventListener("DOMContentLoaded", () => {
    const inputProduto = document.getElementById("pesquisaprod");
    const botaoPesquisar = document.getElementById("btnPesquisar");
    const resultadoDiv = document.getElementById("infoProd");
    const nomeProdutoSpan = document.getElementById("nomeProduto");

    botaoPesquisar.addEventListener("click", async () => {
        const nomeProduto = inputProduto.value.trim();
        if (!nomeProduto) {
            resultadoDiv.innerHTML = "<p>Digite um nome de produto.</p>";
            return;
        }

        try {
            const response = await fetch(`/buscar-produto?nome=${encodeURIComponent(nomeProduto)}`);
            const data = await response.json();
            console.log(data.tempo_producao)
            if (response.ok) {
                nomeProdutoSpan.textContent = data.nome || "Produto";
                resultadoDiv.innerHTML = `
                    <p><strong>EAN:</strong> ${data.ean || "N/A"}</p>
                    <p><strong>Cor:</strong> ${data.cor || "N/A"}</p>
                    <p><strong>Estoque:</strong> ${data.estoque || "N/A"}</p>
                    <p><strong>Preço Clássico:</strong> ${data["preco_classico"].toFixed(2) || "N/A"}</p>
                    <p><strong>Preço Premium:</strong> ${data["preco_premium"].toFixed(2) || "N/A"}</p>
                    <p><strong>SKU:</strong> ${data.sku || "N/A"}</p>
                    <p><strong>Descrição:</strong> ${data.descricao || "N/A"}</p>
                    <p><strong>Marca:</strong> ${data.marca || "N/A"}</p>
                    <p><strong>Modelo:</strong> ${data.modelo || "N/A"}</p>
                    <p><strong>Dimensões (A x L x C):</strong> ${data.altura || "N/A"} x ${data.largura || "N/A"} x ${data.comprimento || "N/A"}</p>
                    <p><strong>Tempo de Produção:</strong> ${data.tempo_producao} Dias</p>
                    <p><strong>Categoria na SHOPPE:</strong> ${data["CATEGORIA (SHOPPE)"] || "N/A"}</p>
                    ${data["link_youtube"] ? `<p><a href="${data["link_youtube"]}" target="_blank">Vídeo do Produto</a></p>` : ""}
                    ${data.fotos ? `<img src="${data.fotos}" alt="Imagem do Produto" style="max-width: 100%; height: auto;">` : ""}
                `;
            } else {
                resultadoDiv.innerHTML = `<p>${data.erro}</p>`;
            }
        } catch (error) {
            resultadoDiv.innerHTML = "<p>Erro ao buscar o produto. Tente novamente.</p>";
            console.error("Erro na requisição:", error);
        }
    });
});
*/

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
