// --- DADOS E ESTADO DA APLICAÇÃO ---

let vehiclesData = [
    { id: 1, placa: 'GRL-3178', nomePersonalizado: 'Carro do Diretor', marca: 'Dodge', modelo: 'STEALTH 2000', setor: 'Diretoria', hodometro: 150234, status: 'Ativo' },
    { id: 2, placa: 'PHN-1507', nomePersonalizado: 'Veículo de Vendas 01', marca: 'Audi', modelo: 'R8 2025', setor: 'Vendas', hodometro: 120, status: 'Desabilitado' },
    { id: 3, placa: 'XYZ-1234', nomePersonalizado: 'Carro de Entregas', marca: 'Fiat', modelo: 'Fiorino 2023', setor: 'Logística', hodometro: 89500, status: 'Ativo' },
    { id: 4, placa: 'ABC-9876', nomePersonalizado: 'Suporte Técnico', marca: 'Renault', modelo: 'Kwid 2022', setor: 'Operações', hodometro: 45300, status: 'Ativo' },
    { id: 5, placa: 'QWE-4567', nomePersonalizado: 'Manutenção Externa', marca: 'Volkswagen', modelo: 'Saveiro 2021', setor: 'Manutenção', hodometro: 112000, status: 'Desabilitado' }
];

let currentSortBy = 'placa';
let currentSortOrder = 'asc';

// --- FUNÇÕES DE LÓGICA E RENDERIZAÇÃO ---

function sortData(vehicles) { /* (código inalterado) */ return vehicles.sort((a, b) => { const valA = a[currentSortBy]; const valB = b[currentSortBy]; let comparison = 0; if (typeof valA === 'number' && typeof valB === 'number') { comparison = valA - valB; } else { comparison = String(valA).localeCompare(String(valB)); } return currentSortOrder === 'desc' ? comparison * -1 : comparison; }); }

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
                    <button class="action-btn toggle-status-btn" data-tooltip="${vehicle.status === 'Ativo' ? 'Desabilitar' : 'Habilitar'}">
                        <i class="fas ${vehicle.status === 'Ativo' ? 'fa-toggle-on status-active' : 'fa-toggle-off status-inactive'}"></i>
                    </button>
                    <button class="action-btn" data-tooltip="Dar Baixa"><i class="fas fa-archive"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += rowHTML;
    });
    
    addEditButtonListeners();
    addToggleStatusButtonListeners();
}

function updateSortIcons() { /* (código inalterado) */ }

function applyFiltersAndSort() { /* (código inalterado) */ }

function clearAndApplyFilters() { /* (código inalterado) */ }

function initializeTooltips() { /* (código inalterado) */ }

// --- LÓGICA DO MODAL ---
const modalOverlay = document.getElementById('modal-overlay');
const vehicleForm = document.getElementById('vehicle-form');
const modalTitle = document.getElementById('modal-title');
const vehicleIdInput = document.getElementById('vehicle-id');

function openModal(mode, vehicleData = null) { /* (código inalterado) */ }
function closeModal() { /* (código inalterado) */ }
function handleFormSubmit(event) { /* (código inalterado) */ }

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

/**
 * Adiciona 'escutadores' de clique aos botões de Habilitar/Desabilitar status.
 */
function addToggleStatusButtonListeners() {
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            // 1. Pega o ID do veículo a partir do atributo 'data-id' da linha (<tr>)
            const row = event.target.closest('tr');
            const vehicleId = parseInt(row.getAttribute('data-id'));
            
            // 2. Encontra o veículo correspondente no nosso array de dados
            const vehicle = vehiclesData.find(v => v.id === vehicleId);

            if (vehicle) {
                // 3. Inverte o status do veículo
                vehicle.status = (vehicle.status === 'Ativo') ? 'Desabilitado' : 'Ativo';
                
                // 4. Mostra uma notificação de sucesso
                showToast(`Status do veículo ${vehicle.placa} alterado para ${vehicle.status}!`, 'success');

                // 5. Re-renderiza a tabela para refletir a mudança
                applyFiltersAndSort();
            }
        });
    });
}

// --- LÓGICA DA NOTIFICAÇÃO TOAST ---
function showToast(message, type = 'success') { /* (código inalterado) */ }

// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // (todo o código de inicialização e listeners permanece o mesmo)
    // ...
});

// (O código do CSS do Tooltip permanece o mesmo)
if (!document.querySelector('#tooltip-styles')) { /* ... (código inalterado) ... */ }