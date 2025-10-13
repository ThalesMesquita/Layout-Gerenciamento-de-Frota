// --- DADOS E ESTADO DA APLICAÇÃO ---

const vehiclesData = [
    { id: 1, placa: 'GRL-3178', nomePersonalizado: 'Carro do Diretor', marca: 'Dodge', modelo: 'STEALTH 2000', setor: 'Diretoria', hodometro: 150234, status: 'Ativo' },
    { id: 2, placa: 'PHN-1507', nomePersonalizado: 'Veículo de Vendas 01', marca: 'Audi', modelo: 'R8 2025', setor: 'Vendas', hodometro: 120, status: 'Desabilitado' },
    { id: 3, placa: 'XYZ-1234', nomePersonalizado: 'Carro de Entregas', marca: 'Fiat', modelo: 'Fiorino 2023', setor: 'Logística', hodometro: 89500, status: 'Ativo' },
    { id: 4, placa: 'ABC-9876', nomePersonalizado: 'Suporte Técnico', marca: 'Renault', modelo: 'Kwid 2022', setor: 'Operações', hodometro: 45300, status: 'Ativo' },
    { id: 5, placa: 'QWE-4567', nomePersonalizado: 'Manutenção Externa', marca: 'Volkswagen', modelo: 'Saveiro 2021', setor: 'Manutenção', hodometro: 112000, status: 'Desabilitado' }
];

// Variáveis de estado para controlar a ordenação
let currentSortBy = 'placa'; // Coluna padrão para ordenação
let currentSortOrder = 'asc'; // Ordem padrão ('asc' ou 'desc')


// --- FUNÇÕES DE LÓGICA E RENDERIZAÇÃO ---

/**
 * Ordena um array de veículos com base nas variáveis de estado globais.
 * @param {Array} vehicles - O array de veículos a ser ordenado.
 * @returns {Array} O array de veículos ordenado.
 */
function sortData(vehicles) {
    return vehicles.sort((a, b) => {
        const valA = a[currentSortBy];
        const valB = b[currentSortBy];

        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB; // Compara como número
        } else {
            comparison = String(valA).localeCompare(String(valB)); // Compara como texto
        }

        // Inverte o resultado se a ordem for descendente
        return currentSortOrder === 'desc' ? comparison * -1 : comparison;
    });
}


/**
 * Renderiza as linhas da tabela de veículos com base nos dados fornecidos.
 * @param {Array} vehicles - O array de objetos de veículos a ser renderizado.
 */
function renderTable(vehicles) {
    const tableBody = document.getElementById('vehicle-table-body');
    tableBody.innerHTML = '';

    if (vehicles.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum veículo encontrado.</td></tr>`;
        return;
    }

    vehicles.forEach(vehicle => {
        const rowHTML = `
            <tr>
                <td><span class="text-primary">${vehicle.placa}</span><span class="text-secondary">${vehicle.nomePersonalizado}</span></td>
                <td><span class="text-primary">${vehicle.marca}</span><span class="text-secondary">${vehicle.modelo}</span></td>
                <td>${vehicle.setor}</td>
                <td>${vehicle.hodometro.toLocaleString('pt-BR')} km</td>
                <td><span class="status-badge ${vehicle.status === 'Ativo' ? 'status-active' : 'status-inactive'}">${vehicle.status}</span></td>
                <td class="actions-cell">
                    <button class="action-btn" data-tooltip="Editar"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-btn" data-tooltip="Visualizar"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" data-tooltip="${vehicle.status === 'Ativo' ? 'Desabilitar' : 'Habilitar'}"><i class="fas ${vehicle.status === 'Ativo' ? 'fa-toggle-on status-active' : 'fa-toggle-off status-inactive'}"></i></button>
                    <button class="action-btn" data-tooltip="Dar Baixa"><i class="fas fa-archive"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += rowHTML;
    });
}

/**
 * Atualiza os ícones nos cabeçalhos da tabela para refletir a ordenação atual.
 */
function updateSortIcons() {
    document.querySelectorAll('.sortable-header').forEach(header => {
        const icon = header.querySelector('i');
        const sortBy = header.getAttribute('data-sort-by');

        // Reseta todos os ícones para o padrão
        icon.className = 'fas fa-sort';
        header.classList.remove('sorted');

        // Se este for o cabeçalho atualmente ordenado, atualiza o ícone
        if (sortBy === currentSortBy) {
            icon.className = currentSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            header.classList.add('sorted');
        }
    });
}


/**
 * Aplica os filtros e a ordenação com base nos valores e estado atuais e atualiza a tabela.
 */
function applyFiltersAndSort() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const sectorFilter = document.getElementById('sector-filter').value;

    let processedVehicles = [...vehiclesData]; // Cria uma cópia para não modificar o original

    // 1. Filtragem
    if (searchTerm) {
        processedVehicles = processedVehicles.filter(v => Object.values(v).some(val => String(val).toLowerCase().includes(searchTerm)));
    }
    if (statusFilter) {
        processedVehicles = processedVehicles.filter(v => v.status === statusFilter);
    }
    if (sectorFilter) {
        processedVehicles = processedVehicles.filter(v => v.setor === sectorFilter);
    }

    // 2. Ordenação
    processedVehicles = sortData(processedVehicles);
    
    // 3. Renderização e UI
    renderTable(processedVehicles);
    initializeTooltips();
    updateSortIcons();
}

/**
 * Inicializa ou re-inicializa os tooltips.
 */
function initializeTooltips() {
    // (código do tooltip permanece o mesmo da etapa anterior)
    const tooltippedElements = document.querySelectorAll('[data-tooltip]');
    let tooltip = document.querySelector('.tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip);
    }
    tooltippedElements.forEach(elem => { /* ... (código inalterado) ... */ });
}


// --- INICIALIZAÇÃO E EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos de filtro
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const sectorFilter = document.getElementById('sector-filter');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // Adiciona os "escutadores" de eventos para os filtros
    searchInput.addEventListener('input', applyFiltersAndSort);
    statusFilter.addEventListener('change', applyFiltersAndSort);
    sectorFilter.addEventListener('change', applyFiltersAndSort);

    // Evento para o botão de limpar filtros
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = '';
        sectorFilter.value = '';
        applyFiltersAndSort();
    });
    
    // Adiciona os "escutadores" de eventos para os cabeçalhos da tabela
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.getAttribute('data-sort-by');
            
            // Se clicou na mesma coluna, inverte a ordem. Senão, define a nova coluna e reseta a ordem.
            if (sortBy === currentSortBy) {
                currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortBy = sortBy;
                currentSortOrder = 'asc';
            }
            
            applyFiltersAndSort();
        });
    });

    // Renderização inicial
    applyFiltersAndSort();
});


// (O código do CSS do Tooltip permanece o mesmo)
if (!document.querySelector('#tooltip-styles')) { /* ... (código inalterado) ... */ }