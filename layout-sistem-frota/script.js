// --- DADOS E ESTADO DA APLICAÇÃO ---

let vehiclesData = [ // Mudou de const para let para podermos adicionar/remover itens
    { id: 1, placa: 'GRL-3178', nomePersonalizado: 'Carro do Diretor', marca: 'Dodge', modelo: 'STEALTH 2000', setor: 'Diretoria', hodometro: 150234, status: 'Ativo' },
    { id: 2, placa: 'PHN-1507', nomePersonalizado: 'Veículo de Vendas 01', marca: 'Audi', modelo: 'R8 2025', setor: 'Vendas', hodometro: 120, status: 'Desabilitado' },
    { id: 3, placa: 'XYZ-1234', nomePersonalizado: 'Carro de Entregas', marca: 'Fiat', modelo: 'Fiorino 2023', setor: 'Logística', hodometro: 89500, status: 'Ativo' },
    { id: 4, placa: 'ABC-9876', nomePersonalizado: 'Suporte Técnico', marca: 'Renault', modelo: 'Kwid 2022', setor: 'Operações', hodometro: 45300, status: 'Ativo' },
    { id: 5, placa: 'QWE-4567', nomePersonalizado: 'Manutenção Externa', marca: 'Volkswagen', modelo: 'Saveiro 2021', setor: 'Manutenção', hodometro: 112000, status: 'Desabilitado' }
];

let currentSortBy = 'placa';
let currentSortOrder = 'asc';

// --- FUNÇÕES DE LÓGICA E RENDERIZAÇÃO ---

function sortData(vehicles) {
    // (código inalterado)
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
        const rowHTML = `
            <tr data-id="${vehicle.id}">
                <td><span class="text-primary">${vehicle.placa}</span><span class="text-secondary">${vehicle.nomePersonalizado}</span></td>
                <td><span class="text-primary">${vehicle.marca}</span><span class="text-secondary">${vehicle.modelo}</span></td>
                <td>${vehicle.setor}</td>
                <td>${vehicle.hodometro.toLocaleString('pt-BR')} km</td>
                <td><span class="status-badge ${vehicle.status === 'Ativo' ? 'status-active' : 'status-inactive'}">${vehicle.status}</span></td>
                <td class="actions-cell">
                    <button class="action-btn edit-btn" data-tooltip="Editar"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-btn" data-tooltip="Visualizar"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" data-tooltip="${vehicle.status === 'Ativo' ? 'Desabilitar' : 'Habilitar'}"><i class="fas ${vehicle.status === 'Ativo' ? 'fa-toggle-on status-active' : 'fa-toggle-off status-inactive'}"></i></button>
                    <button class="action-btn" data-tooltip="Dar Baixa"><i class="fas fa-archive"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += rowHTML;
    });
    
    // Adiciona os event listeners aos botões de editar recém-criados
    addEditButtonListeners();
}


function updateSortIcons() {
    // (código inalterado)
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
    initializeTooltips();
    updateSortIcons();
}

function initializeTooltips() { /* (código inalterado) */ }

// --- LÓGICA DO MODAL ---
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('vehicle-modal');
const modalTitle = document.getElementById('modal-title');
const vehicleForm = document.getElementById('vehicle-form');
const vehicleIdInput = document.getElementById('vehicle-id');

function openModal(mode, vehicleData = null) {
    vehicleForm.reset(); // Limpa o formulário
    
    if (mode === 'create') {
        modalTitle.innerText = 'Cadastrar Novo Veículo';
        vehicleIdInput.value = ''; // Garante que o ID está vazio
    } else if (mode === 'edit') {
        modalTitle.innerText = 'Editar Veículo';
        // Preenche o formulário com os dados do veículo
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
    event.preventDefault(); // Impede o recarregamento da página

    const formData = {
        id: vehicleIdInput.value ? parseInt(vehicleIdInput.value) : Date.now(), // Cria um novo ID se não houver
        placa: document.getElementById('placa').value,
        nomePersonalizado: document.getElementById('nomePersonalizado').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        setor: document.getElementById('setor').value,
        hodometro: parseInt(document.getElementById('hodometro').value),
        status: document.getElementById('status').value,
    };

    if (vehicleIdInput.value) { // Se tem um ID, está editando
        const index = vehiclesData.findIndex(v => v.id === formData.id);
        vehiclesData[index] = formData;
        showToast('Veículo atualizado com sucesso!', 'success');
    } else { // Senão, está criando
        vehiclesData.push(formData);
        showToast('Veículo cadastrado com sucesso!', 'success');
    }
    
    closeModal();
    applyFiltersAndSort(); // Atualiza a tabela
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

// --- LÓGICA DA NOTIFICAÇÃO TOAST ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMessage.innerText = message;
    toast.className = `toast ${type}`; // Limpa classes antigas e adiciona a nova
    toastIcon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // Esconde após 3 segundos
}


// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // Listeners dos filtros (código inalterado)
    document.getElementById('search-input').addEventListener('input', applyFiltersAndSort);
    document.getElementById('status-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sector-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('sector-filter').value = '';
        applyFiltersAndSort();
    });
    
    // Listeners da ordenação (código inalterado)
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
    
    // Listeners do Modal
    document.querySelector('.btn-primary[data-tooltip!=""]').addEventListener('click', () => openModal('create')); // Botão "Cadastrar Veículo"
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    vehicleForm.addEventListener('submit', handleFormSubmit);

    // Renderização inicial
    applyFiltersAndSort();
});


// (O código do CSS do Tooltip permanece o mesmo)
if (!document.querySelector('#tooltip-styles')) { /* ... (código inalterado) ... */ }