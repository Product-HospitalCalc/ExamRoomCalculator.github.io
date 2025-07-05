document.addEventListener("DOMContentLoaded", function () {
    let porcentaje = roomUtilizationTarget;
    const canvas = document.getElementById('donnutChart');
    const ctx = canvas.getContext('2d');
    
    // Crear el input invisible para edición
    const editInput = document.createElement('input');
    editInput.type = 'number';
    editInput.min = '0';
    editInput.max = '100';
    editInput.style.position = 'absolute';
    editInput.style.background = 'transparent';
    editInput.style.border = 'none';
    editInput.style.outline = 'none';
    editInput.style.textAlign = 'right';
    editInput.style.color = '#088eb0';
    editInput.style.fontWeight = 'bold';
    editInput.style.fontSize = '20px';
    editInput.style.width = '60px';
    editInput.style.height = '30px';
    editInput.style.display = 'none';
    editInput.style.zIndex = '1000';
    editInput.style.cursor = 'text';
    
    // Insertar el input después del canvas
    canvas.parentNode.insertBefore(editInput, canvas.nextSibling);

    const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [porcentaje, 100 - porcentaje],
                backgroundColor: ['#088eb0', '#E0E0E0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,
            circumference: 270, 
            cutout: '50%',
            plugins: {
                title: {
                    display: true,
                    text: "Room Utilization",
                    font: {
                        size: 17,        
                        weight: 'bold'   
                    },
                },
                legend: { display: false },
                tooltip: { enabled: false }
            },
            events: ['click', 'mousemove'],
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function (chart) {
                const ctx = chart.ctx;
                const width = chart.width;
                const height = chart.height;

                ctx.save();
                const fontSize = height / 9;
                ctx.font = `${fontSize}px Arial`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'top';

                const textX = width * 0.4;
                const textY = height * 0.65;

                chart.customCenterText = {
                    x: textX,
                    y: textY,
                    fontSize: fontSize
                };

                // Solo dibujar el texto si NO estamos en modo edición
                if (!chart.isEditingMode) {
                    // Cambiar color si está en modo hover
                    const isHovering = chart.isHoveringText || false;
                    ctx.fillStyle = isHovering ? "#066a85" : "#088eb0";
                    ctx.font = `bold ${fontSize + 1}px Arial`;
                    
                    // Añadir sombra sutil para efecto hover
                    if (isHovering) {
                        ctx.shadowColor = 'rgba(8, 142, 176, 0.3)';
                        ctx.shadowBlur = 5;
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;
                    }
                    
                    ctx.fillText(`${porcentaje}%`, textX, textY);

                    // Resetear sombra
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;

                    // Añadir indicador visual de que es editable
                    if (isHovering) {
                        ctx.fillStyle = "#088eb0";
                        ctx.font = `${fontSize * 0.35}px Arial`;
                        ctx.fillText("✎ Click to edit", textX, textY + fontSize + 25);
                    }
                }

                // Siempre dibujar el texto "TARGET"
                ctx.font = `bold ${fontSize * 0.5}px Arial`;
                ctx.fillStyle = "#666";
                ctx.fillText("TARGET", textX, textY + fontSize + 5);
                
                ctx.font = `${fontSize * 0.5}px Arial`;
                ctx.restore();
            }
        }]
    });

    // Función para posicionar el input sobre el texto
    function positionInput() {
        const rect = canvas.getBoundingClientRect();
        const center = myChart.customCenterText;
        if (!center) return;

        const canvasStyle = window.getComputedStyle(canvas);
        const fontSize = center.fontSize;
        
        editInput.style.left = `${rect.left + center.x - 55}px`;
        editInput.style.top = `${rect.top + center.y - 2}px`;
        editInput.style.fontSize = `${fontSize + 1}px`;
        editInput.style.width = `${fontSize * 2.5}px`;
        editInput.style.height = `${fontSize + 5}px`;
    }

    // Manejar movimiento del mouse para hover effect
    canvas.addEventListener("mousemove", function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const center = myChart.customCenterText;
        if (!center) return;

        const boxSize = center.fontSize;
        const isInCenterText =
            x >= center.x - 70 && x <= center.x + boxSize / 2 &&
            y >= center.y && y <= center.y + boxSize * 2;

        if (isInCenterText !== myChart.isHoveringText) {
            myChart.isHoveringText = isInCenterText;
            canvas.style.cursor = isInCenterText ? 'pointer' : 'default';
            myChart.update('none'); // Actualizar sin animación
        }
    });

    // Manejar cuando el mouse sale del canvas
    canvas.addEventListener("mouseleave", function () {
        if (myChart.isHoveringText) {
            myChart.isHoveringText = false;
            canvas.style.cursor = 'default';
            myChart.update('none');
        }
    });

    // Manejar click en el área del texto
    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const center = myChart.customCenterText;
        if (!center) return;

        const boxSize = center.fontSize;
        const isInCenterText =
            x >= center.x - 70 && x <= center.x + boxSize / 2 &&
            y >= center.y && y <= center.y + boxSize * 2;

        if (isInCenterText) {
            showEditInput();
        }
    });

    // Función para mostrar el input de edición
    function showEditInput() {
        // Activar modo edición para ocultar el texto del canvas
        myChart.isEditingMode = true;
        myChart.update('none'); // Actualizar sin animación
        
        positionInput();
        editInput.value = porcentaje;
        editInput.style.display = 'block';
        editInput.focus();
        editInput.select();
        
        // Añadir animación de fade in
        editInput.style.opacity = '0';
        editInput.style.transition = 'opacity 0.2s ease-in-out';
        setTimeout(() => {
            editInput.style.opacity = '1';
        }, 10);
    }

    // Función para ocultar el input de edición
    function hideEditInput() {
        // Desactivar modo edición para mostrar el texto del canvas
        myChart.isEditingMode = false;
        myChart.update('none'); // Actualizar sin animación
        
        editInput.style.display = 'none';
        editInput.style.transition = '';
    }

    // Función para actualizar el valor
    function updateValue(newValue) {
        const num = parseInt(newValue);
        if (!isNaN(num) && num >= 0 && num <= 100) {
            porcentaje = num;
            roomUtilizationTarget = porcentaje;
            updateDonnutChart();
            window.updateChart(getPrecalculatedData());
            return true;
        }
        return false;
    }

    // Event listeners para el input
    editInput.addEventListener('blur', function () {
        const isValid = updateValue(editInput.value);
        if (!isValid) {
            // Mostrar brevemente un mensaje de error
            editInput.style.backgroundColor = '#ffe6e6';
            editInput.style.border = '1px solid #ff4444';
            setTimeout(() => {
                editInput.style.backgroundColor = 'transparent';
                editInput.style.border = 'none';
            }, 1000);
        }
        hideEditInput();
    });

    editInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const isValid = updateValue(editInput.value);
            if (!isValid) {
                // Mostrar brevemente un mensaje de error
                editInput.style.backgroundColor = '#ffe6e6';
                editInput.style.border = '1px solid #ff4444';
                setTimeout(() => {
                    editInput.style.backgroundColor = 'transparent';
                    editInput.style.border = 'none';
                    hideEditInput();
                }, 1000);
            } else {
                hideEditInput();
            }
        } else if (event.key === 'Escape') {
            editInput.value = porcentaje; // Restaurar valor original
            hideEditInput();
        }
    });

    // Reposicionar el input cuando la ventana cambie de tamaño
    window.addEventListener('resize', function () {
        if (editInput.style.display === 'block') {
            positionInput();
        }
    });

    function updateDonnutChart() {
        myChart.data.datasets[0].data = [porcentaje, 100 - porcentaje];
        myChart.update();
        window.calculateDataForSelectedYears();
    }
});