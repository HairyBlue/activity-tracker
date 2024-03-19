<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted, watch } from 'vue';

const chartCanva = ref<any>();
const props = defineProps(['dataset']);
const dataset = ref<any>(props.dataset);
let chartInstance: any;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function createChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }
  Chart.defaults.font.size = 12;

  // window.addEventListener('beforeprint', () => {
  //   chartInstance.resize(600, 300);
  // });

  chartInstance = new Chart(chartCanva.value.getContext('2d'), {
    type: 'line',
    plugins: [ChartDataLabels],
    data: {
      labels: MONTHS,
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
          datalabels: { anchor: 'start', align: 'end' },
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
    },
  });
}

watch([props.dataset], ([newDataset], [oldDataset]) => {
  if (newDataset !== oldDataset) {
    dataset.value = newDataset;
    createChart();
  }
});

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
  <div class="card h-[40vh] w-[92vw] p-6">
    <canvas ref="chartCanva"> </canvas>
  </div>
</template>
