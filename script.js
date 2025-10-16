// --- DADOS E ESTADO DA APLICAÇÃO ---

let vehiclesData = []; // O array começa vazio. Será preenchido pelos dados iniciais ou pelo LocalStorage.

// Dados padrão para a primeira vez que o sistema for aberto
const initialVehiclesData = [
    { id: 1, placa: 'GRL-3178', nomePersonalizado: 'Carro do Diretor', marca: 'Dodge', modelo: 'STEALTH 2000', setor: 'Diretoria', hodometro: 150234, status: 'Ativo' },
    { id: 2, placa: 'PHN-1507', nomePersonalizado: 'Veículo de Vendas 01', marca: 'Audi', modelo: 'R8 2025', setor: 'Vendas', hodometro: 120, status: 'Desabilitado' },
    { id: 3, placa: 'XYZ-1234', nomePersonalizado: 'Carro de Entregas', marca: 'Fiat', modelo: 'Fiorino 2023', setor: 'Logística', hodometro: 89500, status: 'Ativo' },
    { id: 4, placa: 'ABC-9876', nomePersonalizado: 'Suporte Técnico', marca: 'Renault', modelo: 'Kwid 2022', setor: 'Operações', hodometro: 45300, status: 'Ativo' },
    { id: 5, placa: 'QWE-4567', nomePersonalizado: 'Manutenção Externa', marca: 'Volkswagen', modelo: 'Saveiro 2021', setor: 'Manutenção', hodometro: 112000, status: 'Desabilitado' }
];

let currentSortBy = 'placa';
let currentSortOrder = 'asc';

// --- FUNÇÕES DE PERSISTÊNCIA DE DADOS ---

function saveDataToLocalStorage() {
    localStorage.setItem('fleetData', JSON.stringify(vehiclesData));
}

function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('fleetData');
    if (savedData && savedData.length > 2) {
        vehiclesData = JSON.parse(savedData);
    } else {
        vehiclesData = initialVehiclesData;
    }
}

// --- FUNÇÕES DE LÓGICA E RENDERIZAÇÃO ---

function sortData(vehicles) {
    return vehicles.sort((a, b) => {
        const valA = a[currentSortBy];
        const valB = b[currentSortBy];
        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        } else {
            comparison = String(valA).localeCompare(String(valB));
        }
        return currentSortOrder === 'desc' ? comparison * -1 : comparison;
    });
}

function renderTable(vehicles) {
    const tableBody = document.getElementById('vehicle-table-body');
    tableBody.innerHTML = '';
    if (vehicles.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Nenhum veículo encontrado.</td></tr>`;
        return;
    }
    vehicles.forEach(vehicle => {
        const rowHTML = `<tr data-id="${vehicle.id}"><td><span class="text-primary">${vehicle.placa}</span><span class="text-secondary">${vehicle.nomePersonalizado}</span></td><td><span class="text-primary">${vehicle.marca}</span><span class="text-secondary">${vehicle.modelo}</span></td><td>${vehicle.setor}</td><td>${vehicle.hodometro.toLocaleString('pt-BR')} km</td><td><span class="status-badge ${vehicle.status === 'Ativo' ? 'status-active' : 'status-inactive'}">${vehicle.status}</span></td><td class="actions-cell"><button class="action-btn edit-btn" data-tooltip="Editar"><i class="fas fa-pencil-alt"></i></button><button class="action-btn toggle-status-btn" data-tooltip="${vehicle.status === 'Ativo' ? 'Desabilitar' : 'Habilitar'}"><i class="fas ${vehicle.status === 'Ativo' ? 'fa-toggle-on status-active' : 'fa-toggle-off status-inactive'}"></i></button><button class="action-btn delete-btn" data-tooltip="Excluir"><i class="fas fa-trash"></i></button></td></tr>`;
        tableBody.innerHTML += rowHTML;
    });
    addEditButtonListeners();
    addToggleStatusButtonListeners();
    addDeleteButtonListeners();
}

function updateSortIcons() {
    document.querySelectorAll('.sortable-header').forEach(header => {
        const icon = header.querySelector('i');
        const sortBy = header.getAttribute('data-sort-by');
        icon.className = 'fas fa-sort';
        header.classList.remove('sorted');
        if (sortBy === currentSortBy) {
            icon.className = currentSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            header.classList.add('sorted');
        }
    });
}

function updateSummaryCards() {
    const totalVehicles = vehiclesData.length;
    const activeVehicles = vehiclesData.filter(v => v.status === 'Ativo').length;
    const disabledVehicles = totalVehicles - activeVehicles;
    document.getElementById('total-vehicles-summary').innerText = totalVehicles;
    document.getElementById('active-vehicles-summary').innerText = activeVehicles;
    document.getElementById('disabled-vehicles-summary').innerText = disabledVehicles;
}

function updatePaginationSummary(filteredVehicles) {
    const totalResults = filteredVehicles.length;
    const paginationSpan = document.getElementById('pagination-summary');
    if (totalResults === 0) {
        paginationSpan.innerText = 'Nenhum resultado encontrado';
    } else if (totalResults === 1) {
        paginationSpan.innerText = 'Exibindo 1 de 1 resultado';
    } else {
        paginationSpan.innerText = `Exibindo 1-${totalResults} de ${totalResults} resultados`;
    }
}

function applyFiltersAndSort() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const sectorFilter = document.getElementById('sector-filter').value;
    let processedVehicles = [...vehiclesData];
    if (searchTerm) {
        processedVehicles = processedVehicles.filter(v => Object.values(v).some(val => String(val).toLowerCase().includes(searchTerm)));
    }
    if (statusFilter) {
        processedVehicles = processedVehicles.filter(v => v.status === statusFilter);
    }
    if (sectorFilter) {
        processedVehicles = processedVehicles.filter(v => v.setor === sectorFilter);
    }
    processedVehicles = sortData(processedVehicles);
    renderTable(processedVehicles);
    updateSummaryCards();
    updatePaginationSummary(processedVehicles);
    initializeTooltips();
    updateSortIcons();
}

function clearAndApplyFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('sector-filter').value = '';
    applyFiltersAndSort();
}

function initializeTooltips() {
    const tooltippedElements = document.querySelectorAll('[data-tooltip]');
    let tooltip = document.querySelector('.tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip);
    }
    document.querySelectorAll('[data-tooltip]').forEach(elem => {
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

// --- LÓGICA DO MODAL ---
const modalOverlay = document.getElementById('modal-overlay');
const vehicleForm = document.getElementById('vehicle-form');
const modalTitle = document.getElementById('modal-title');
const vehicleIdInput = document.getElementById('vehicle-id');

function openModal(mode, vehicleData = null) {
    vehicleForm.reset();
    if (mode === 'create') {
        modalTitle.innerText = 'Cadastrar Novo Veículo';
        vehicleIdInput.value = '';
    } else if (mode === 'edit') {
        modalTitle.innerText = 'Editar Veículo';
        vehicleIdInput.value = vehicleData.id;
        document.getElementById('placa').value = vehicleData.placa;
        document.getElementById('nomePersonalizado').value = vehicleData.nomePersonalizado;
        document.getElementById('marca').value = vehicleData.marca;
        document.getElementById('modelo').value = vehicleData.modelo;
        document.getElementById('setor').value = vehicleData.setor;
        document.getElementById('hodometro').value = vehicleData.hodometro;
        document.getElementById('status').value = vehicleData.status;
    }
    modalOverlay.classList.add('visible');
}

function closeModal() {
    modalOverlay.classList.remove('visible');
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = {
        id: vehicleIdInput.value ? parseInt(vehicleIdInput.value) : Date.now(),
        placa: document.getElementById('placa').value,
        nomePersonalizado: document.getElementById('nomePersonalizado').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        setor: document.getElementById('setor').value,
        hodometro: parseInt(document.getElementById('hodometro').value),
        status: document.getElementById('status').value,
    };
    if (vehicleIdInput.value) {
        const index = vehiclesData.findIndex(v => v.id === formData.id);
        vehiclesData[index] = formData;
        showToast('Veículo atualizado com sucesso!', 'success');
    } else {
        vehiclesData.push(formData);
        showToast('Veículo cadastrado com sucesso!', 'success');
    }
    saveDataToLocalStorage();
    closeModal();
    clearAndApplyFilters();
}

function addEditButtonListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const vehicleId = parseInt(row.getAttribute('data-id'));
            const vehicle = vehiclesData.find(v => v.id === vehicleId);
            if (vehicle) {
                openModal('edit', vehicle);
            }
        });
    });
}

function addToggleStatusButtonListeners() {
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const vehicleId = parseInt(row.getAttribute('data-id'));
            const vehicle = vehiclesData.find(v => v.id === vehicleId);
            if (vehicle) {
                vehicle.status = (vehicle.status === 'Ativo') ? 'Desabilitado' : 'Ativo';
                showToast(`Status do veículo ${vehicle.placa} alterado para ${vehicle.status}!`, 'success');
                saveDataToLocalStorage();
                applyFiltersAndSort();
            }
        });
    });
}

function addDeleteButtonListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const vehicleId = parseInt(row.getAttribute('data-id'));
            const vehicle = vehiclesData.find(v => v.id === vehicleId);
            if (vehicle) {
                const wantsToDelete = confirm(`Você tem certeza que deseja excluir o veículo de placa ${vehicle.placa}? Esta ação não pode ser desfeita.`);
                if (wantsToDelete) {
                    vehiclesData = vehiclesData.filter(v => v.id !== vehicleId);
                    showToast(`Veículo ${vehicle.placa} excluído com sucesso!`, 'success');
                    saveDataToLocalStorage();
                    applyFiltersAndSort();
                }
            }
        });
    });
}

// --- LÓGICA DA NOTIFICAÇÃO TOAST ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    toastMessage.innerText = message;
    toast.className = `toast ${type}`;
    toastIcon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromLocalStorage();
    
    document.getElementById('search-input').addEventListener('input', applyFiltersAndSort);
    document.getElementById('status-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sector-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('clear-filters-btn').addEventListener('click', clearAndApplyFilters);
    
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.getAttribute('data-sort-by');
            if (sortBy === currentSortBy) {
                currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortBy = sortBy;
                currentSortOrder = 'asc';
            }
            applyFiltersAndSort();
        });
    });
    
    document.getElementById('add-vehicle-btn').addEventListener('click', () => openModal('create'));
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) { closeModal(); }
    });
    vehicleForm.addEventListener('submit', handleFormSubmit);

    applyFiltersAndSort();
});

// Adiciona o CSS do Tooltip se ele ainda não existir
if (!document.querySelector('#tooltip-styles')) {
    const tooltipStyle = `.tooltip { position: fixed; display: none; background-color: var(--color-text-primary); color: var(--color-text-light); padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; z-index: 1000; pointer-events: none; white-space: nowrap; }`;
    const styleSheet = document.createElement("style");
    styleSheet.id = 'tooltip-styles';
    styleSheet.innerText = tooltipStyle;
    document.head.appendChild(styleSheet);
}
