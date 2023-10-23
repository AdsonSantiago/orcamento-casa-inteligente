// Função para calcular o preço total
function calculateTotal() {
    var checkboxes = document.querySelectorAll('input[name="products"]:checked');
    var totalPrice = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.value.includes("-")) {
            var pricePart = checkbox.value.split(" - ")[1]; // Obtém a parte do preço
            
            if (/^R\$\d+\.\d{2}$/.test(pricePart)) {
                // Remove "R$ " e converte para um número
                var price = parseFloat(pricePart.replace("R$", ""));
                totalPrice += price;
            } else {
                console.error("Formato de valor inválido:", pricePart);
            }
        }
    });

    return totalPrice.toFixed(2);
}

// Função para gerar a página de orçamento
function generateBudget() {
    const selectedProducts = document.querySelectorAll('input[id^="product"]');
    const observations = document.querySelectorAll('input[name="observations"]'); // Seleciona todos os campos de observação

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
        var pricePart = input.parentElement.querySelector('.produto-text').textContent.split(" - ")[1];
        
        // Acesse a observação correspondente ao produto atual
        var observationInput = observations[index];
        var observation = observationInput ? observationInput.value : ''; // Obtém a observação correspondente

        if (/^R\$\d+\.\d{2}$/.test(pricePart)) {
            var price = parseFloat(pricePart.replace("R$", ""));
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
         totalPrice: totalPrice.toFixed(2) };
}


// Associa a função de geração de orçamento ao botão
const generateButton = document.getElementById('generateButton');
generateButton.addEventListener('click', generateBudget);


////////////////////////////////////////////////////////////////////////////////////////////////
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
    //doc.text('Cliente', 100, 35);
    doc.setFontStyle('normal');

    doc.text('Nome: ' + nomeSolicitante, 10, 45);
    //doc.text('Telefone: ' + telefoneSolicitante, 10, 50);
    doc.text('Email: ' + emailSolicitante, 10, 52);
    
    
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

    // Adicione campos Cliente
    doc.text('Nome: ' + nomeCliente, 10, 265);
    doc.text('Email: ' + emailCliente, 10, 270);
    
    var base64String = doc.output('datauristring');
    window.open(base64String, '_blank');
    doc.save('teste.pdf');
    
};


function duplicarSecao() {
    event.preventDefault();
    // Selecione a seção original que deseja duplicar
    const secaoOriginal = document.getElementById('ambiente-duplicado');
  
    if (secaoOriginal) {
        // Remova a classe "escondida" para exibir a seção duplicada
        secaoOriginal.classList.remove('escondida');
    } else {
        console.log("Seção original não encontrada.");
    }
  
    var novoAmbienteInput = document.createElement('input');
    novoAmbienteInput.type = 'text';
    novoAmbienteInput.id = 'ambiente-novo';
    novoAmbienteInput.placeholder = 'Nome do Ambiente Novo';
    
    var containerNovoAmbiente = document.getElementById('ambiente-duplicado');
    containerNovoAmbiente.appendChild(novoAmbienteInput);
  }



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
  



