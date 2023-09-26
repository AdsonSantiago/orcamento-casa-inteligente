
// Dicionário de preços por produto (você pode preenchê-lo com os preços)
const precoPorProduto = {
  product1: 999.0,
  product2: 529.0,
  product3: 429.0,
  product4: 429.0,
  product5: 349.0,
  product6: 349.0,
  product7: 1999.0,
  product8: 1799.0,
  product9: 339.0,
  product10: 1499.0,
  product11: 2999.0,
  product12: 2799.0,
  product13: 2499.0,
  product14: 2599.0,
  product15: 11999.0,
  product16: 499.0,
  product17: 69.0,
  product18: 119.0,
  product19: 179.0,
  product20: 219.0,
  product21: 219.0,
  product22: 399.0,
  product23: 179.0,
  product24: 209.0,
  product25: 2599.0,
  product26: 959.0,
  product27: 129.0,
  product28: 99.0,
  product29: 299.0,
  product30: 269.0,
  product31: 169.0,
  product32: 179.0,
  product33: 189.0,
  product34: 69.0,
  product35: 69.0,
  product36: 89.0,
  product37: 149.0,
  product38: 219.0,
  product39: 59.0,
  product40: 209.0,
  product41: 199.0,
  product42: 279.0,
  product43: 259.0,
  product44: 299.0,
  product45: 369.0,
  product46: 2599.0,
  product47: 3099.0,
  product48: 4449.0,
  product49: 4299.0,
  product50: 2099.0,
  product51: 1699.0,
  product52: 3199.0,
  product53: 1299.0,
  product54: 1599.0,
  product55: 5299.0,
  product56: 269.0,
  product57: 699.0,
  product58: 299.0,
  product59: 599.0,
  product60: 279.0,
  product61: 449.0,
  product62: 369.0,
  product63: 239.0,
  product64: 299.0,
  product64: 5299.0,

  // Adicione mais produtos e preços conforme necessário
};
 

// Carrinho de compras virtual
const carrinhoDeCompras = {
  secao1: {},
  secao2: {},
};
 

// Função para calcular o subtotal de uma seção específica
function calcularSubtotal(secao) {

  let subtotal = 0;
 
  for (const produtoName in carrinhoDeCompras[secao]) {
    const produto = carrinhoDeCompras[secao][produtoName];
    const quantidade = produto.quantidade;
 
    console.log("Nome do produto:", produtoName);
    var preco = precoPorProduto[produtoName];
    console.log("Preço do produto:", preco);

    subtotal += quantidade * preco;
  }
  return subtotal;
}
 

// Função para atualizar a exibição dos subtotais
function atualizarSubtotais() {
  const subtotalSecao1 = calcularSubtotal('secao1');
  const subtotalSecao2 = calcularSubtotal('secao2');
  const totalGeral = subtotalSecao1 + subtotalSecao2;
 

  // Atualizar a exibição dos subtotais na página HTML
  document.getElementById('subtotalSecao1').textContent = `Subtotal 1:`;
  document.getElementById('subtotal1').textContent = subtotalSecao1.toFixed(2);

  document.getElementById('subtotal2').textContent = subtotalSecao2.toFixed(2);
  document.getElementById('subtotalSecao2').textContent = `Subtotal 2:`;
 
  document.getElementById('totalGeral').textContent = `Total Geral: `;
  document.getElementById('totalGerado').textContent = totalGeral.toFixed(2);
}

 
let observacao = ''; // Declare observacao no escopo global e defina-a como uma string vazia
 

// Manipulador de eventos para as seleções de produtos
document.querySelectorAll('.produto-container input[type="number"]').forEach((input) => {
  input.addEventListener('change', (event) => {
    const secao = event.target.closest('section').classList.contains('secao1') ? 'secao1' : 'secao2';
    const produtoId = event.target.id;
    const produtoName = event.target.name;
    const quantidade = parseInt(event.target.value);
 

    if (!isNaN(quantidade)) {
      const preco = precoPorProduto[produtoId];
     

      // Obtenha a observação diretamente do elemento de input com o id correspondente
      const observationId = 'observation' + produtoId;
      const observationInput = document.getElementById(observationId);
      const observacao = observationInput ? observationInput.value : '';
 

      // Atualize o carrinho de compras com a quantidade e a observação
      carrinhoDeCompras[secao][produtoId] = {
        name: produtoName,
        quantidade: quantidade,
        preco: preco,
        observacao: observacao,
      };
    } else {
      // Lida com entradas inválidas
      delete carrinhoDeCompras[secao][produtoId];
    }

 
    atualizarSubtotais();
  });
});

// Manipulador de eventos para o botão "Gerar Excel"
document.getElementById('gerarExcelButton').addEventListener('click', () => {
  // Defina produtosSelecionados com base no carrinho de compras
  const produtosSelecionados = [];

  for (const secao in carrinhoDeCompras) {
    for (const produtoId in carrinhoDeCompras[secao]) {
      const produto = carrinhoDeCompras[secao][produtoId];
      const quantidade = produto.quantidade;
      const preco = precoPorProduto[produtoId];
      const observacao = produto.observacao;
 

      if (quantidade > 0) {
        produtosSelecionados.push({
          Nome: produto.name,
          Quantidade: quantidade,
          Preço: preco,
          observation: observacao,
        });
      }
    }
  }
 
  // Chame a função para gerar a planilha Excel
  gerarExcel(produtosSelecionados);
});
 

function gerarExcel(produtosSelecionados) {
  try {
    // Crie uma planilha
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(produtosSelecionados);

    // Adicione a planilha ao livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, 'Produtos Selecionados');

    // Gere um arquivo XLSX e crie um link para download
    XLSX.writeFile(wb, 'orcamento.xlsx'); // Use XLSX.writeFile para simplificar
  } catch (error) {
    console.error('Erro ao gerar o arquivo Excel:', error);
  }
}

 
// Adicione um evento de clique ao botão
document.getElementById("mostrarEsconderBotao").addEventListener("click", function() {
  var tabela = document.querySelector(".mini-tabela");

  if (tabela.style.display === "none") {
    tabela.style.display = "table"; // Mostra a tabela
    this.innerText = "Ocultar Tabela"; // Altera o texto do botão
  } else {
    tabela.style.display = "none"; // Oculta a tabela
    this.innerText = "Abrir Tabela"; // Altera o texto do botão de volta
  }
});