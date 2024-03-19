<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted, watch } from 'vue';

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
  // Chart.defaults.font.size = 10;

  // window.addEventListener('beforeprint', () => {
  //   chartInstance.resize(600, 300);
  // });

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
          // backgroundColor: [
          //   'rgba(255, 99, 132, 0.2)',
          //   'rgba(255, 159, 64, 0.2)',
          //   'rgba(255, 205, 86, 0.2)',
          //   'rgba(75, 192, 192, 0.2)',
          //   'rgba(54, 162, 235, 0.2)',
          //   'rgba(153, 102, 255, 0.2)',
          //   'rgba(201, 203, 207, 0.2)',
          // ],
          //borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
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
      //   layout: {
      //     padding: 5,
      //   },
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
        },
      },
      plugins: {
        datalabels: {
          formatter: function (value: any, ctx: any) {
            // Format the value with a percent symbol
            return value + ' %';
          },
        },
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
  <div class="card h-[60vh] w-[92vw] p-6">
    <h2 class="text-center text-lg font-semibold"><slot></slot></h2>
    <canvas ref="chartCanvaPct"> </canvas>
  </div>
</template>
