function toggleInputType() {
    const inputType = document.getElementById('inputType').value;
    const inputsMoles = document.getElementById('inputsMoles');
    const inputsGrams = document.getElementById('inputsGrams');
    
    if (inputType === 'moles') {
        inputsMoles.style.display = 'block';
        inputsGrams.style.display = 'none';
    } else {
        inputsMoles.style.display = 'none';
        inputsGrams.style.display = 'block';
    }
}

function calcular() {
    const inputType = document.getElementById('inputType').value;
    const massaMolarH2SO4 = 98.085; // g/mol
    let rl = 0;
    let hplusQuantidade, so4Quantidade = 0;
    let productQG = 0;
    let productQM = 0;
    

    if (inputType === 'moles') {
        hplusQuantidade = parseFloat(document.getElementById('hplusMoles').value);
        so4Quantidade = parseFloat(document.getElementById('so4Moles').value);
        const purezaHplusGrams = parseFloat(document.getElementById('purezaHplusGrams').value) / 100;
        const purezaSo4Grams = parseFloat(document.getElementById('purezaSo4Grams').value) / 100;
        
        hplusGrams *= purezaHplusGrams;
        so4Grams *= purezaSo4Grams;        

        if (hplusQuantidade  < so4Quantidade) {
            rl = hplusQuantidade;
        }else {
            rl = so4Quantidade;
        }
        
        productQM = rl / 2;
        productQG = productQM * massaMolarH2SO4;
        

    } else {
        let hplusGrams = parseFloat(document.getElementById('hplusGrams').value);
        let so4Grams = parseFloat(document.getElementById('so4Grams').value);
        const purezaHplusGrams = parseFloat(document.getElementById('purezaHplusGrams').value) / 100;
        const purezaSo4Grams = parseFloat(document.getElementById('purezaSo4Grams').value) / 100;
        
        hplusGrams *= purezaHplusGrams;
        so4Grams *= purezaSo4Grams;
        
        if (hplusQuantidade  < so4Quantidade) {
            rl = hplusQuantidade;
        }else {
            rl = so4Quantidade;
        }
        
        productQG = rl / 2;
        productQM = productQG / massaMolarH2SO4;
    }

    // Obtém a massa real de H2SO4
    const massaRealH2SO4 = parseFloat(document.getElementById('massaRealH2SO4').value);

    // Calcula a pureza
    let rendimento;
    rendimento = (massaRealH2SO4 / productQM) * 100;
   
    // Descrição detalhada do produto
    const descricaoProduto = `
        <h3>Descrição Detalhada do Produto</h3>
        <p><strong>Nome:</strong> Ácido Sulfúrico (H₂SO₄)</p>
        <p><strong>Fórmula Molecular:</strong> H₂SO₄</p>
        <p><strong>Massa Molar:</strong> 98,08 g/mol</p>
        <p><strong>Quantidade Obtida:</strong> ${productQM.toFixed(2)} mol</p>
        <p><strong>Massa Obtida:</strong> ${productQG.toFixed(2)} g</p>
        <p><strong>Rendimeto da reação:</strong> ${rendimento ? rendimento.toFixed(2) + '%' : 'N/A'}</p>
    `;

    document.getElementById('descricaoProduto').innerHTML = descricaoProduto;

    // Gera o gráfico de reação
    gerarGraficoReacao(hplusQuantidade, so4Quantidade, productQM);

    document.getElementById('erro').innerText = '';
}

function gerarGraficoReacao(hplusQuantidade, so4Quantidade, h2so4Quantidade) {
    const ctx = document.getElementById('reactionChart').getContext('2d');
    
    const tempo = [0, 1, 2, 3, 4, 5]; // Exemplo de tempo em minutos
    const hplusQuantidades = tempo.map(t => Math.max(0, hplusQuantidade - t * (hplusQuantidade / 5)));
    const so4Quantidades = tempo.map(t => Math.max(0, so4Quantidade - t * (so4Quantidade / 5)));
    const h2so4Quantidades = tempo.map(t => Math.min(h2so4Quantidade, t * (h2so4Quantidade / 5)));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: tempo,
            datasets: [
                {
                    label: 'H⁺ (mol)',
                    data: hplusQuantidades,
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'SO₄²⁻ (mol)',
                    data: so4Quantidades,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'H₂SO₄ (mol)',
                    data: h2so4Quantidades,
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Progresso da Reação ao Longo do Tempo'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Tempo (min)'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Quantidade (mol)'
                    }
                }]
            }
        }
    });
}
