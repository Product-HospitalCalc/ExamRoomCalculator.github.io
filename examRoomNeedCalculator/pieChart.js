document.addEventListener("DOMContentLoaded", function () {
  // these represent the initial values for the three components
  // their sum equals the initial total of 45 minutes
  let breakdownValues = [12.5, 13, 19.5]; // [MA Visit, Wait in Exam, Provider Visit]

  let editingIndex = null; // this is the index of the component that is being edited
  let hoverIndex = null; // this is the index of the component that is being hovered

  // DOM References
  const avgClinicVisitInput = document.getElementById("avg-clinic-visit-time");

  // we treat the total field as the master for the 100% value
  // we attach an event listener on it so that if the user manually changes it, it rescales the breakdown values proportionally
  avgClinicVisitInput.addEventListener("input", function () {
    const newTotal = parseFloat(avgClinicVisitInput.value) || 0;
    const oldTotal = breakdownValues.reduce((a, b) => a + b, 0);
    if (oldTotal === 0) {
      // distribute equally
      breakdownValues = [newTotal / 3, newTotal / 3, newTotal / 3];
    } else {
      const factor = newTotal / oldTotal;
      breakdownValues = breakdownValues.map((val) => val * factor);
    }
    updatePieChart();
  });

  // init pie chart
  const pieCanvas = document.getElementById("pieChart");
  const pieCtx = pieCanvas.getContext("2d");
  const clickToEditPlugin = {
    afterDraw: function (chart) {
      if (hoverIndex !== null) {
        const meta = chart.getDatasetMeta(0);
        const arc = meta.data[hoverIndex];
        if (!arc) return;
        const ctx = chart.ctx;

        // Calculate the position of the label
        const labelPos = getLabelPosition(arc);

        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "10px Arial";
        // Draw the text just below the label
        ctx.fillText("✎ Click to edit", labelPos.x, labelPos.y + 20);
        ctx.restore();
      }
    },
  };
  let myPieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["MA Visit", "Wait in Exam", "Provider Visit"],
      datasets: [
        {
          label: "Clinic Visit Time",
          data: [...breakdownValues],
          backgroundColor: [
            "#0096D7", // MA Visit
            "#B3D335", // Wait in Exam
            "#FF9800", // Provider Visit
          ],
          hoverOffset: 12,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            if (editingIndex === ctx.dataIndex) return "";
            const dataset = ctx.chart.data.datasets[0];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total
              ? ((value / total) * 100).toFixed(1) + "%"
              : "0%";
            return `${value.toFixed(1)} min\n(${percentage})`;
          },
          color: "#fff",
          font: { weight: "bold" },
          textAlign: "center",
        },
        title: {
          display: true,
          text: " Room Utilization",
          font: {
            size: 17,
            weight: "bold",
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const dataset =
                tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total
                ? ((tooltipItem.parsed / total) * 100).toFixed(1) + "%"
                : "0%";
              return `${tooltipItem.label}: ${tooltipItem.parsed.toFixed(
                1
              )} min (${percentage})`;
            },
          },
          xAlign: "center",
          yAlign: "bottom",
        },
      },
      onClick: function (evt, elements) {
        if (!elements.length) return;
        const index = elements[0].index;
        const meta = myPieChart.getDatasetMeta(0);
        const pos = meta.data[index].tooltipPosition();

        // Remove the old input if it exists
        let oldInput = document.getElementById("inlinePieInput");
        if (oldInput) oldInput.remove();

        // Mark the index as editing and update the chart
        editingIndex = index;
        myPieChart.update();

        showEditInput(index, pos);
      },
    },
    plugins: [ChartDataLabels, clickToEditPlugin],
  });

  function updatePieChart() {
    // update the pie chart dataset from breakdownValues
    myPieChart.data.datasets[0].data = breakdownValues.map((val) =>
      parseFloat(val.toFixed(1))
    );
    myPieChart.update();
  }

  // initital setup: set  total field to sum of breakdown values
  function initializeTotal() {
    const total = breakdownValues.reduce((a, b) => a + b, 0);
    avgClinicVisitInput.value = total.toFixed(1);
  }

  initializeTotal();
  updatePieChart();

  // Add cursor pointer to pie chart
  pieCanvas.addEventListener("mousemove", function (evt) {
    const points = myPieChart.getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      true
    );
    if (points.length) {
      pieCanvas.style.cursor = "pointer";
      hoverIndex = points[0].index;
    } else {
      pieCanvas.style.cursor = "default";
      hoverIndex = null;
    }
    myPieChart.draw(); // Redibuja para mostrar/ocultar el texto
  });

  // Function to show the edit input
  function showEditInput(index, pos) {
    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.1";
    input.min = "0";
    input.value = breakdownValues[index].toFixed(1);
    input.id = "inlinePieInput";
    input.style.position = "absolute";
    input.style.left = pieCanvas.offsetLeft + pos.x - 30 + "px";
    input.style.top = pieCanvas.offsetTop + pos.y + 10 + "px";
    input.style.width = "60px";
    input.style.textAlign = "center";
    input.style.fontWeight = "light";
    input.style.padding = "2px 4px";
    input.style.outline = "none";
    input.style.backgroundColor = "transparent";
    input.style.color = "#fff";
    input.style.fontSize = "14px";
    input.style.fontWeight = "bold";

    pieCanvas.parentNode.appendChild(input);
    input.focus();
    input.select();

    function finishEdit(apply) {
      if (apply) {
        const newValue = parseFloat(input.value);
        if (!isNaN(newValue) && newValue >= 0) {
          breakdownValues[index] = newValue;
          avgClinicVisitInput.value = breakdownValues
            .reduce((a, b) => a + b, 0)
            .toFixed(1);
          updatePieChart();
        }
      }
      input.remove();
      editingIndex = null;
      myPieChart.update();
    }

    // handle keyboard events
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") finishEdit(true);
      if (e.key === "Escape") finishEdit(false);
    });

    // handle blur event
    // if the user clicks outside the input, we apply the changes
    input.addEventListener("blur", function () {
      finishEdit(true);
    });
  }

  // Function to get the position of the label
  function getLabelPosition(arc) {
    const angle = (arc.startAngle + arc.endAngle) / 2;
    const radius = (arc.outerRadius + arc.innerRadius) / 2;
    const x = arc.x + Math.cos(angle) * radius;
    const y = arc.y + Math.sin(angle) * radius;
    return { x, y };
  }
});
