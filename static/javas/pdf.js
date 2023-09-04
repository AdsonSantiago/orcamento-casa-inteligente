// pdf.js

function gerarPDF(produtosSelecionados) {
    var doc = new jsPDF();
    var logo = new Image();
    logo.onload = function() {
        doc.addImage(logo, 'PNG', 175, 270, 30, 20);
        doc.text('Olá, segue PDF exemplo!', 10, 20);
        doc.text('Produtos Selecionados:', 10, 40);
        var yPos = 50;
        const lineHeight = doc.internal.getLineHeight();
        const produtosNumerados = produtosSelecionados.map((produto, index) => `${index + 1}. ${produto}`);

        doc.text(produtosNumerados, 10, yPos);
        yPos += lineHeight * produtosSelecionados.length;
        var base64String = doc.output('datauristring');
 
        window.open(base64String, '_blank');
    };
    logo.src = '../static/img/vivo-120.png';
};

// Adicionar um ouvinte de eventos ao botão para gerar o PDF quando clicado
const otherButton = document.getElementById('otherButton');
otherButton.addEventListener('click', function () {
    const produtosSelecionados = [];


    // Coletar os produtos selecionados
    const checkboxes = document.querySelectorAll('input[type="number"]');
    checkboxes.forEach(function (number) {
        if (number.checked) {
            const produtoText = number.parentElement.querySelector('.produto-text').innerText;
            produtosSelecionados.push(produtoText);
        }
    });

    // Gerar o PDF com base nos produtos selecionados
    gerarPDF(produtosSelecionados);
});
