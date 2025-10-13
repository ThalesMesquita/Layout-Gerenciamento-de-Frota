// --- DADOS E ESTADO DA APLICAÇÃO ---

const vehiclesData = [
    { id: 1, placa: 'GRL-3178', nomePersonalizado: 'Carro do Diretor', marca: 'Dodge', modelo: 'STEALTH 2000', setor: 'Diretoria', hodometro: 150234, status: 'Ativo' },
    { id: 2, placa: 'PHN-1507', nomePersonalizado: 'Veículo de Vendas 01', marca: 'Audi', modelo: 'R8 2025', setor: 'Vendas', hodometro: 120, status: 'Desabilitado' },
    { id: 3, placa: 'XYZ-1234', nomePersonalizado: 'Carro de Entregas', marca: 'Fiat', modelo: 'Fiorino 2023', setor: 'Logística', hodometro: 89500, status: 'Ativo' },
    { id: 4, placa: 'ABC-9876', nomePersonalizado: 'Suporte Técnico', marca: 'Renault', modelo: 'Kwid 2022', setor: 'Operações', hodometro: 45300, status: 'Ativo' },
    { id: 5, placa: 'QWE-4567', nomePersonalizado: 'Manutenção Externa', marca: 'Volkswagen', modelo: 'Saveiro 2021', setor: 'Manutenção', hodometro: 112000, status: 'Desabilitado' }
];

// --- FUNÇÕES DE RENDERIZAÇÃO E LÓGICA ---

/**
 * Renderiza as linhas da tabela de veículos com base nos dados fornecidos.
 * @param {Array} vehicles - O array de objetos de veículos a ser renderizado.
 */
function renderTable(vehicles) {
    const tableBody = document.getElementById('vehicle-table-body');
    tableBody.innerHTML = ''; // Limpa a tabela antes de renderizar

    if (vehicles.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum veículo encontrado.</td></tr>`;
        return;
    }

    vehicles.forEach(vehicle => {
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
        tableBody.innerHTML += rowHTML;
    });
}

/**
 * Aplica os filtros com base nos valores dos inputs e selects e atualiza a tabela.
 */
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const sectorFilter = document.getElementById('sector-filter').value;

    // Começa com todos os dados e vai filtrando
    let filteredVehicles = vehiclesData;

    // 1. Filtro de Busca (searchTerm)
    if (searchTerm) {
        filteredVehicles = filteredVehicles.filter(vehicle =>
            vehicle.placa.toLowerCase().includes(searchTerm) ||
            vehicle.nomePersonalizado.toLowerCase().includes(searchTerm) ||
            vehicle.marca.toLowerCase().includes(searchTerm) ||
            vehicle.modelo.toLowerCase().includes(searchTerm)
        );
    }

    // 2. Filtro de Status
    if (statusFilter) {
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === statusFilter);
    }

    // 3. Filtro de Setor
    if (sectorFilter) {
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.setor === sectorFilter);
    }

    // Renderiza a tabela com os dados filtrados
    renderTable(filteredVehicles);
    // Re-inicializa os tooltips para os botões que acabaram de ser renderizados
    initializeTooltips();
}

/**
 * Inicializa ou re-inicializa os tooltips para os elementos com o atributo 'data-tooltip'.
 */
function initializeTooltips() {
    const tooltippedElements = document.querySelectorAll('[data-tooltip]');
    let tooltip = document.querySelector('.tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip);
    }
    
    tooltippedElements.forEach(elem => {
        elem.addEventListener('mouseover', () => {
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

// --- INICIALIZAÇÃO E EVENT LISTENERS ---

// Garante que o script seja executado após o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos de filtro
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const sectorFilter = document.getElementById('sector-filter');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // Adiciona os "escutadores" de eventos que chamarão a função de filtro
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    sectorFilter.addEventListener('change', applyFilters);

    // Evento para o botão de limpar filtros
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = '';
        sectorFilter.value = '';
        applyFilters(); // Aplica os filtros (agora vazios) para resetar a tabela
    });

    // Renderiza a tabela com os dados iniciais
    renderTable(vehiclesData);
    initializeTooltips();
});

// Adiciona o CSS do Tooltip se ele ainda não existir
if (!document.querySelector('#tooltip-styles')) {
    const tooltipStyle = `
        .tooltip { position: fixed; display: none; background-color: var(--color-text-primary); color: var(--color-text-light); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; z-index: 1000; pointer-events: none; white-space: nowrap; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = 'tooltip-styles';
    styleSheet.innerText = tooltipStyle;
    document.head.appendChild(styleSheet);
}