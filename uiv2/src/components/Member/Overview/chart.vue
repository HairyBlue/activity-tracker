<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted } from 'vue';

const chartCanvaPct = ref<any>();
const props = defineProps(['label', 'dataset', 'type']);
const label = ref<any>(props.label);
const dataset = ref<any>(props.dataset);
const type = ref<any>(props.type);
let chartInstance: any;

function createChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvaPct.value.getContext('2d'), {
    type: type.value,
    plugins: [ChartDataLabels],
    data: {
      labels: label.value,
      datasets: [
        {
          label: '',
          data: dataset.value,
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          borderWidth: 1,
          datalabels: {
            anchor: 'start',
            align: 'end',
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'x',
      scales: {
        x: {
          grid: {
            drawOnChartArea: true,
          },
        },
        y: {
          grid: {
            drawOnChartArea: true,
          },

          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        //   datalabels: {
        //     formatter: function (value: any) {
        //       return value + ' %';
        //     },
        //   },
        legend: {
          labels: {
            font: {
              size: 16, // Set font size for legend labels
            },
          },
        },
        tooltip: {
          bodyFont: {
            size: 16, // Set font size for tooltip body
          },
        },
      },
    },
  });
}

// watch([props.dataset, props.label, props.title], ([newDataset, newLabel, newTitle], [oldDataset, oldeLabel, oldeTitle]) => {
//   if (newDataset !== oldDataset && newLabel !== oldeLabel && newTitle !== oldeTitle) {
//     dataset.value = newDataset;
//     label.value = newLabel;
//     title.value = newTitle;
//     createChart();
//   }
// });

// watch([type.value], ([newType], [oldType]) => {
//   if (newType !== oldType) {
//     type.value = newType;
//   }
// });
onMounted(() => {
  createChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="h-[400px]">
    <h2 class="text-center text-lg font-semibold"><slot></slot></h2>
    <canvas ref="chartCanvaPct"> </canvas>
  </div>
</template>
