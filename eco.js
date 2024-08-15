window.onload = function() {
    const canvas = document.getElementById('connections');
    const ctx = canvas.getContext('2d');
    const nodes = document.querySelectorAll('.node');
    const canvasRect = canvas.getBoundingClientRect();
    
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);

    const relationships = [
        { from: 'mainPerson', to: 'family' },
        { from: 'mainPerson', to: 'friends' },
        { from: 'mainPerson', to: 'work' },
        { from: 'mainPerson', to: 'community' },
        { from: 'mainPerson', to: 'healthcare' },
        { from: 'mainPerson', to: 'school' },
        { from: 'mainPerson', to: 'pets' },
        { from: 'mainPerson', to: 'neighbors' },
    ];

    function drawConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        relationships.forEach(rel => {
            const fromNode = document.getElementById(rel.from);
            const toNode = document.getElementById(rel.to);

            const fromPos = fromNode.getBoundingClientRect();
            const toPos = toNode.getBoundingClientRect();

            const fromX = fromPos.left + fromPos.width / 2 - canvasRect.left;
            const fromY = fromPos.top + fromPos.height / 2 - canvasRect.top;
            const toX = toPos.left + toPos.width / 2 - canvasRect.left;
            const toY = toPos.top + toPos.height / 2 - canvasRect.top;

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);

            // Dotted line style
            ctx.strokeStyle = 'blue'; // Color of the dotted line
            ctx.setLineDash([5, 15]); // Dotted line pattern
            ctx.lineWidth = 2;

            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    function updateMap() {
        const searchTerm = document.getElementById('search').value.toLowerCase();

        nodes.forEach(node => {
            const nodeName = node.textContent.toLowerCase();
            if (nodeName.includes(searchTerm)) {
                node.classList.add('highlight');
                node.style.zIndex = '1'; // Bring highlighted nodes to the front
            } else {
                node.classList.remove('highlight');
                node.style.zIndex = ''; // Reset z-index
            }
        });

        drawConnections();
    }

    document.getElementById('search').addEventListener('input', updateMap);

    // Initialize the map
    drawConnections(); // Initial drawing of connections

    // Remove draggable functionality
    nodes.forEach(node => {
        node.removeEventListener('mouseenter', () => {});
        node.removeEventListener('mousemove', () => {});
        node.removeEventListener('mouseleave', () => {});
        node.removeEventListener('mousedown', () => {});
        node.removeEventListener('mouseup', () => {});
        document.removeEventListener('mousemove', () => {});

        node.addEventListener('click', () => {
            const modal = document.getElementById('infoModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalText = document.getElementById('modalText');
            modalTitle.textContent = node.textContent;
            modalText.textContent = node.getAttribute('data-info');
            modal.style.display = 'block';

            // Set focus to the modal
            modal.focus();
        });

        // ARIA attributes and keyboard events
        node.setAttribute('tabindex', '0');
        node.setAttribute('role', 'button');

        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                node.click();
            }
        });
    });

    // Close the modal
    const modal = document.getElementById('infoModal');
    const closeModal = document.getElementsByClassName('close')[0];
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // ARIA attributes for modal
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('tabindex', '-1');
};
