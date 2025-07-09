document.addEventListener("DOMContentLoaded", function () {
  // Assume this is a global or accessible variable
  // let roomUtilizationTarget = 85; 

  let porcentaje = roomUtilizationTarget;
  const canvas = document.getElementById('donnutChart');
  const ctx = canvas.getContext('2d');

  // Create the invisible input for editing
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
  editInput.style.width = '60px'; // Initial width, will be adjusted
  editInput.style.height = '30px'; // Initial height, will be adjusted
  editInput.style.display = 'none';
  editInput.style.zIndex = '1000';
  editInput.style.cursor = 'text';

  // Insert the input after the canvas
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
            size: 17, // Initial size, will be made responsive
            weight: 'bold'
          },
        },
        legend: { display: false },
        tooltip: { enabled: false }
      },
      events: ['click', 'mousemove', 'mouseleave'],
      // UPDATED: Use onResize for responsive font adjustments
      onResize: function(chart, size) {
          const newTitleSize = Math.max(12, Math.min(18, size.width / 20));
          chart.options.plugins.title.font.size = newTitleSize;
      }
    },
    plugins: [{
      id: 'centerText',
      beforeDraw: function (chart) {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        ctx.save();
        const fontSize = height / 9;
        ctx.font = `bold ${fontSize + 1}px Arial`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';

        const textX = width * 0.42; // Adjusted for better centering with right-align
        const textY = height * 0.65;
        
        // UPDATED: Measure text to get precise width for hover detection
        const textMetrics = ctx.measureText(`${porcentaje}%`);

        // Store calculated positions and dimensions for external use (hover, click, input positioning)
        chart.customCenterText = {
          x: textX,
          y: textY,
          fontSize: fontSize,
          // NEW: Store the measured width of the percentage text
          measuredWidth: textMetrics.width 
        };

        // Only draw the text if NOT in editing mode
        if (!chart.isEditingMode) {
          const isHovering = chart.isHoveringText || false;
          ctx.fillStyle = isHovering ? "#066a85" : "#088eb0";
          ctx.font = `bold ${fontSize + 1}px Arial`;

          if (isHovering) {
            ctx.shadowColor = 'rgba(8, 142, 176, 0.3)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }

          ctx.fillText(`${porcentaje}%`, textX, textY);
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          if (isHovering) {
            ctx.fillStyle = "#088eb0";
            ctx.font = `italic ${fontSize * 0.35}px Arial`;
            ctx.fillText("✎ Click to edit", textX, textY + fontSize + 25);
          }
        }

        // Always draw the "TARGET" text
        ctx.font = `bold ${fontSize * 0.5}px Arial`;
        ctx.fillStyle = "#666";
        ctx.fillText("TARGET", textX, textY + fontSize + 5);

        ctx.restore();
      }
    }]
  });

  // Function to position the input over the text
  function positionInput() {
    const rect = canvas.getBoundingClientRect();
    const center = myChart.customCenterText;
    if (!center) return;

    const fontSize = center.fontSize;
    
    // Dynamically set font size and dimensions for the input
    editInput.style.fontSize = `${fontSize + 1}px`;
    editInput.style.width = `${center.measuredWidth + 15}px`; // Set width based on text width + padding
    editInput.style.height = `${fontSize + 5}px`;
    
    // UPDATED: Center the input dynamically using its own width
    const inputWidth = editInput.offsetWidth;
    editInput.style.left = `${rect.left + window.scrollX + center.x - inputWidth}px`;
    editInput.style.top = `${rect.top + window.scrollY + center.y - 2}px`;
  }

  // Handle mouse movement for hover effect
  canvas.addEventListener("mousemove", function (event) {
    if (myChart.isEditingMode) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const center = myChart.customCenterText;
    if (!center) return;

    // UPDATED: Use measuredWidth for precise hover detection
    const isInCenterText =
      x >= center.x - center.measuredWidth && x <= center.x &&
      y >= center.y && y <= center.y + center.fontSize * 1.5;

    if (isInCenterText !== myChart.isHoveringText) {
      myChart.isHoveringText = isInCenterText;
      canvas.style.cursor = isInCenterText ? 'pointer' : 'default';
      myChart.update('none'); // Update without animation
    }
  });
  
  // Handle when the mouse leaves the canvas
  canvas.addEventListener("mouseleave", function () {
    if (myChart.isHoveringText) {
      myChart.isHoveringText = false;
      canvas.style.cursor = 'default';
      myChart.update('none');
    }
  });

  // Handle click on the text area
  canvas.addEventListener("click", function (event) {
    // We can just check the hover state, since it's already calculated
    if (myChart.isHoveringText) {
      showEditInput();
    }
  });

  // Function to show the edit input
  function showEditInput() {
    myChart.isEditingMode = true;
    myChart.isHoveringText = false; // Disable hover effect while editing
    canvas.style.cursor = 'default';
    myChart.update('none'); 

    positionInput(); // Position it first
    editInput.value = porcentaje;
    editInput.style.display = 'block';
    editInput.focus();
    editInput.select();

    editInput.style.opacity = '0';
    editInput.style.transition = 'opacity 0.2s ease-in-out';
    setTimeout(() => { editInput.style.opacity = '1'; }, 10);
  }

  // Function to hide the edit input
  function hideEditInput() {
    myChart.isEditingMode = false;
    myChart.update('none');
    editInput.style.display = 'none';
    editInput.style.transition = '';
  }

  // Function to update the value
  function updateValue(newValue) {
    const num = parseInt(newValue);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      porcentaje = num;
      roomUtilizationTarget = porcentaje; // Update global variable if needed
      updateDonnutChart();
      // Assuming these functions exist globally or are accessible
      // window.updateChart(getPrecalculatedData()); 
      return true;
    }
    return false;
  }

  // Event listeners for the input
  editInput.addEventListener('blur', function () {
    updateValue(editInput.value);
    hideEditInput();
  });

  editInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      updateValue(editInput.value);
      hideEditInput();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      editInput.value = porcentaje; // Restore original value
      hideEditInput();
    }
  });

  // Reposition input when window is resized
  window.addEventListener('resize', function () {
    if (myChart.isEditingMode) {
      positionInput();
    }
  });

  function updateDonnutChart() {
    myChart.data.datasets[0].data = [porcentaje, 100 - porcentaje];
    myChart.update();
    // Assuming this function exists globally
    // window.calculateDataForSelectedYears(); 
  }
});