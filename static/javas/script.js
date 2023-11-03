// Função para calcular o preço total
function calculateTotal() {
    var totalPrice = 0;
    document.querySelectorAll('.number-input').forEach(input => {
        if (input.getAttribute('data-price') !== null) {
           var price = parseFloat(input.getAttribute('data-price'));
           totalPrice += price * parseFloat(input.value);
        }
     });
    return totalPrice.toFixed(2);
}

function generateBudget() {
    const selectedProducts = document.querySelectorAll('input[id^="product"]');
    const observations = document.querySelectorAll('input[name="observations"]');
    const result = document.getElementById('result');
    const produtosSelecionados = document.getElementById('selectedProducts');
    const totalPriceElement = document.getElementById('totalPrice');

    // Limpa a lista de produtos selecionados
    produtosSelecionados.innerHTML = '';
  
    var totalPrice = 0; // Inicializa o preço total
    const produtosSelecionadosArray = []; // Para armazenar os produtos selecionados

    selectedProducts.forEach((input, index) => {
        var productName = input.parentElement.querySelector('.produto-text').textContent;
        var quantity = parseInt(input.value);

        //Obtém o atributo data-price correspondente ao produto atual
        var pricePart = input.getAttribute('data-price'); 

        // Acesse a observação correspondente ao produto atual
        var observationInput = observations[index];
        var observation = observationInput ? observationInput.value : '';
  
        if (/^\d+(\.\d{1,2})?$/.test(pricePart)) {
            var price = parseFloat(pricePart);
            var subtotal = price * quantity;

            if (quantity > 0) {
                // Cria um elemento de lista para o produto selecionado com a quantidade e a observação
                var listItem = document.createElement('li');
                listItem.textContent = productName + ' / Qntd: ' + quantity + ' / Obs: ' + observation;
                produtosSelecionados.appendChild(listItem);
  
                totalPrice += subtotal; // Adiciona o subtotal ao preço total

                // Adicione o produto ao array de produtos selecionados
                produtosSelecionadosArray.push({ name: productName, quantity: quantity, observation: observation });
            }
        } else {
            console.error("Formato de valor inválido:", pricePart);
        }
    });


    // Exibe o preço total
    totalPriceElement.textContent = totalPrice.toFixed(2);
  
    // Mostra a página de resultados
    result.style.display = 'block';

    return {
        produtosSelecionados: produtosSelecionadosArray,
        totalPrice: totalPrice.toFixed(2)
    };
  }

// Associa a função de geração de orçamento ao botão
const generateButton = document.getElementById('generateButton');
generateButton.addEventListener('click', generateBudget);

// pdf.js
function gerarPDF(produtosSelecionados, totalPrice) {
    console.log(totalPrice)
    var doc = new jsPDF();
    var logo = new Image();
    
    // Obtenha os elementos de entrada para Solicitante
    var nomeSolicitante = document.getElementById('nomeSolicitante').value;
    //var telefoneSolicitante = document.getElementById('telSolicitante').value;
    var emailSolicitante = document.getElementById('emailSolicitante').value;
    

    // Obtenha os elementos de entrada para Cliente
    var nomeCliente = document.getElementById('nomeCliente').value;
    //var telefoneCliente = document.getElementById('telCliente').value;
    var emailCliente = document.getElementById('emailCliente').value;
    
    logo.src = 'https://cdn.glitch.global/6734fcaa-1157-4b47-9cdf-898c918a353e/vivo-120.png?v=1692977465269';
    doc.addImage(logo, 'PNG', 170, 275, 30, 14);

    doc.text('ORÇAMENTO CASA INTELIGENTE', 105, 15, null, null, 'center');

    // Adicione campos Solicitante
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text('Solicitante', 10, 35);
    doc.text('Cliente', 100, 35);
    doc.setFontStyle('normal');

    doc.text('Nome: ' + nomeSolicitante, 10, 45);
    //doc.text('Telefone: ' + telefoneSolicitante, 10, 50);
    doc.text('Email: ' + emailSolicitante, 10, 52);

    // Adicione campos Cliente
    doc.text('Nome: ' + nomeCliente, 100, 45);
    doc.text('Email: ' + emailCliente, 100, 52);
    
    // Inicialize uma string para a lista de produtos
    var produtosText = '';
    
    produtosSelecionados.forEach((produto, index) => {
        // Adicione cada produto ao PDF
        produtosText += `${index + 1}. ${produto.name} / Qntd: ${produto.quantity}\n Obs: ${produto.observation}\n \n`;
    });

    // Defina a coordenada vertical (y) para a lista de produtos
    var yPos = 80;
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontStyle('bold');
    doc.text('Produtos - Preços:', 10, yPos);
    doc.setFontStyle('normal');
    
    // Adicione a lista de produtos ao PDF
    doc.text(produtosText, 10, yPos + 10, { fontSize: 8 });
    yPos += 10;
    doc.setFontStyle('bold');
    doc.setFontSize(14);
    doc.text(`Valor total: R$ ${totalPrice}`, 10, yPos + 138);
    doc.setFontStyle('normal')
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(128, 0, 128);
    doc.line(10, 230, 200, 230);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 258, 90, 258);
    doc.text('De Acordo', 35, 265);


    var base64String = doc.output('datauristring');
    window.open(base64String, '_blank');
    doc.save('teste.pdf');

};



// Adicione um ouvinte de eventos ao botão "otherButton"
const otherButton = document.getElementById('otherButton');
otherButton.addEventListener('click', function () {
    const { produtosSelecionados, totalPrice } = generateBudget();
  
    // Chame a função gerarPDF com os produtosSelecionados e o totalPrice
    gerarPDF(produtosSelecionados, totalPrice);
});



function filterProducts() {
    const searchTerm = document.getElementById("pesquisa").value.toLowerCase();
    const productContainers = document.getElementsByClassName("produto-container");

    for (let i = 0; i < productContainers.length; i++) {
        const productName = productContainers[i].querySelector(".produto-text").textContent.toLowerCase();

        if (productName.includes(searchTerm)) {
            // Remove a classe "hidden-product" para mostrar o produto correspondente
            productContainers[i].classList.remove("hidden-product");

        } else {
            // Adicione a classe "hidden-product" para ocultar o produto que não corresponde
            productContainers[i].classList.add("hidden-product");
        }
    }
}


// Função para mostrar/ocultar o botão com base na posição da página
window.onscroll = function() {
    var topButton = document.getElementById("topButton");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";

    } else {
        topButton.style.display = "none";
    }
};

// Função para rolar suavemente para o topo quando o botão é clicado
document.getElementById("topButton").onclick = function() {
    document.body.scrollTop = 0; // Para navegadores mais antigos
    document.documentElement.scrollTop = 0; // Para navegadores modernos
};


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
};
  

////////////////////////////////


// Carrinho de compras virtual
const carrinhoDeCompras = {

};
 



function duplicar() {
  // evita que a página atualize ao duplicar
  event.preventDefault();

  // Clona a seção
  const secao = document.querySelector('#ambiente');
  const novaSecao = secao.cloneNode(true);

  // Substitui a classe existente pela classe desejada
  novaSecao.classList.replace('secao1', 'secao2');

  // Insere a cópia na página, logo após o elemento original
  secao.after(novaSecao);

  // Cria um novo identificador para a seção clonada
  const novoId = 'ambiente-' + Math.floor(Math.random() * 1000);
  novaSecao.setAttribute('id', novoId);

  // // Adiciona o novo input à seção clonada
  // const divInput = document.createElement('div');
  // divInput.style.textAlign = 'left';
  // const label = '<label for="inputDinamico">Ambiente:  </label>';
  // const input = '<input type="text" name="inputDinamico" id="inputDinamico">';
  // divInput.insertAdjacentHTML('beforeend', label);
  // divInput.insertAdjacentHTML('beforeend', input);
  // novaSecao.insertAdjacentElement('beforebegin', divInput);

    // Identifica o nome da nova seção
  const nomeSecao = novaSecao.classList[1];

  // Adiciona a nova seção no carrinho de compras
  carrinhoDeCompras[nomeSecao] = novaSecao;

  // Imprime o carrinho de compras no console para verificar se a nova seção foi adicionada
  console.log(carrinhoDeCompras);

  manipuladorEventos();
  adicionarNovaLinha();
  
}
  
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



function adicionarNovaLinha() {
  // Verifique se a linha com id igual a "subtotalSecao2" já existe
  const linhaSecao2 = document.querySelector('#subtotalSecao2');
  
  // Se a linha não existe, crie e insira
  if (!linhaSecao2) {
    // Crie uma nova linha
    const novaLinha = document.createElement('tr');
    novaLinha.className = 'linha-subtotal';
    novaLinha.id = 'subtotalSecao2';
    novaLinha.innerHTML = `
      <td>Subtotal 2:</td>
      <td>R$ 0.00</td>
    `;

    // Encontre a tabela
    const tabelaCarrinho = document.querySelector('.mini-tabela');
    
    // Insira a nova linha na tabela
    tabelaCarrinho.appendChild(novaLinha);
  }
}



let observacao = ''; // Declare observacao no escopo global e defina-a como uma string vazia

function manipuladorEventos() {
  // Manipulador de eventos para as seleções de produtos
  const inputs = document.querySelectorAll('.produto-container input[type="number"]');
  // Adiciona um listener para o evento "change" em cada input
  inputs.forEach(function (input) {
    input.addEventListener('change', function(event) {
      // Encontra a seção pai do input
      const secao = event.target.closest('section').classList.contains('secao1') ? 'secao1' : 'secao2';

      // Obtém o ID e o nome do produto
      const produtoId = event.target.getAttribute('id');
      const produtoName = event.target.getAttribute('name');

      // Obtém a quantidade selecionada, convertendo para um número inteiro
      const quantidade = parseInt(event.target.value);

      // Obtém o preço do produto a partir do atributo "data-price"
      const preco = parseFloat(event.target.getAttribute('data-price'));

      // Obtenha a observação diretamente do elemento de input com o id correspondente
      const observationId = 'observation' + produtoId;
      const observationInput = document.getElementById(observationId);
      const observacao = observationInput ? observationInput.value : '';

      if (!isNaN(quantidade)) {
        // Atualize o carrinho de compras com a quantidade e a observação
        if (!carrinhoDeCompras[secao]) {
          carrinhoDeCompras[secao] = {};
        }

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
