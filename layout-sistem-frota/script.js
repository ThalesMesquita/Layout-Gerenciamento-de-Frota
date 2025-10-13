// Passo 1: Mock Data (Fonte de Dados Falsa)
const vehiclesData = [
    {
        id: 1,
        placa: 'GRL-3178',
        nomePersonalizado: 'Carro do Diretor',
        marca: 'Dodge',
        modelo: 'STEALTH 2000',
        setor: 'Diretoria',
        hodometro: 150234,
        status: 'Ativo'
    },
    {
        id: 2,
        placa: 'PHN-1507',
        nomePersonalizado: 'Veículo de Vendas 01',
        marca: 'Audi',
        modelo: 'R8 2025',
        setor: 'Vendas',
        hodometro: 120,
        status: 'Desabilitado'
    },
    {
        id: 3,
        placa: 'XYZ-1234',
        nomePersonalizado: 'Carro de Entregas',
        marca: 'Fiat',
        modelo: 'Fiorino 2023',
        setor: 'Logística',
        hodometro: 89500,
        status: 'Ativo'
    },
    {
        id: 4,
        placa: 'ABC-9876',
        nomePersonalizado: 'Suporte Técnico',
        marca: 'Renault',
        modelo: 'Kwid 2022',
        setor: 'Operações',
        hodometro: 45300,
        status: 'Ativo'
    },
    {
        id: 5,
        placa: 'QWE-4567',
        nomePersonalizado: 'Manutenção Externa',
        marca: 'Volkswagen',
        modelo: 'Saveiro 2021',
        setor: 'Manutenção',
        hodometro: 112000,
        status: 'Desabilitado'
    }
];

// O resto do código virá aqui...
// Passo 3: Função para Renderizar a Tabela
function renderTable(vehicles) {
    // Seleciona o corpo da tabela onde as linhas serão inseridas
    const tableBody = document.getElementById('vehicle-table-body');
    
    // Limpa qualquer conteúdo existente para evitar duplicatas
    tableBody.innerHTML = '';

    // Itera sobre cada veículo no array de dados
    vehicles.forEach(vehicle => {
        // Usa template literals (crases) para criar o HTML de cada linha dinamicamente
        const rowHTML = `
            <tr>
                <td>
                    <span class="text-primary">${vehicle.placa}</span>
                    <span class="text-secondary">${vehicle.nomePersonalizado}</span>
                </td>
                <td>
                    <span class="text-primary">${vehicle.marca}</span>
                    <span class="text-secondary">${vehicle.modelo}</span>
                </td>
                <td>${vehicle.setor}</td>
                <td>${vehicle.hodometro.toLocaleString('pt-BR')} km</td>
                <td>
                    <span class="status-badge ${vehicle.status === 'Ativo' ? 'status-active' : 'status-inactive'}">
                        ${vehicle.status}
                    </span>
                </td>
                <td class="actions-cell">
                    <button class="action-btn" data-tooltip="Editar"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-btn" data-tooltip="Visualizar"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" data-tooltip="${vehicle.status === 'Ativo' ? 'Desabilitar' : 'Habilitar'}">
                        <i class="fas ${vehicle.status === 'Ativo' ? 'fa-toggle-on status-active' : 'fa-toggle-off status-inactive'}"></i>
                    </button>
                    <button class="action-btn" data-tooltip="Dar Baixa"><i class="fas fa-archive"></i></button>
                </td>
            </tr>
        `;

        // Insere o HTML da linha recém-criada no corpo da tabela
        tableBody.innerHTML += rowHTML;
    });
}

// Passo 4: Chamada Inicial da Função
// Garante que a função seja executada após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza a tabela com os dados iniciais
    renderTable(vehiclesData);

    // Reativa a lógica dos tooltips (vamos colocar aqui para manter tudo funcionando)
    initializeTooltips(); 
});


// Lógica para Tooltips (recolocada dentro de uma função)
function initializeTooltips() {
    const tooltippedElements = document.querySelectorAll('[data-tooltip]');
    let tooltip = document.querySelector('.tooltip'); // Tenta encontrar um tooltip existente

    // Se não existir, cria um novo
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip);
    }
    
    tooltippedElements.forEach(elem => {
        // Remove event listeners antigos para evitar duplicação
        elem.replaceWith(elem.cloneNode(true));
    });
    
    // Adiciona os event listeners aos novos elementos
    document.querySelectorAll('[data-tooltip]').forEach(elem => {
         elem.addEventListener('mouseover', (e) => {
            const tooltipText = elem.getAttribute('data-tooltip');
            tooltip.innerText = tooltipText;
            tooltip.style.display = 'block';

            const rect = elem.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        });

        elem.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
}

// Adiciona o CSS do Tooltip se ele ainda não existir
if (!document.querySelector('#tooltip-styles')) {
    const tooltipStyle = `
        .tooltip {
            position: fixed;
            display: none;
            background-color: var(--color-text-primary);
            color: var(--color-text-light);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = 'tooltip-styles';
    styleSheet.innerText = tooltipStyle;
    document.head.appendChild(styleSheet);
}
