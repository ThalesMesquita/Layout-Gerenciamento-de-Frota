document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para Tooltips ---
    const tooltippedElements = document.querySelectorAll('[data-tooltip]');

    if (tooltippedElements.length > 0) {
        // Criar um único elemento de tooltip para reutilizar
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        document.body.appendChild(tooltip);

        tooltippedElements.forEach(elem => {
            elem.addEventListener('mouseover', (e) => {
                const tooltipText = elem.getAttribute('data-tooltip');
                tooltip.innerText = tooltipText;
                tooltip.style.display = 'block';

                // Posicionar o tooltip
                const rect = elem.getBoundingClientRect();
                tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`; // 8px de espaço
            });

            elem.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }
});


// Adiciona o CSS para o Tooltip diretamente via JS para não precisar de outro arquivo
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
        pointer-events: none; /* Impede que o tooltip interfira com o mouse */
        white-space: nowrap;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = tooltipStyle;
document.head.appendChild(styleSheet);