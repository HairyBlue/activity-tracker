<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted, watch } from 'vue';

const chartCanva = ref<any>();
const props = defineProps(['dataset']);
const dataset = ref<any>(props.dataset);
let chartInstance: any;

function createChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }
  // Chart.defaults.font.size = 16;

  // window.addEventListener('beforeprint', () => {
  //   chartInstance.resize(600, 300);
  // });

  chartInstance = new Chart(chartCanva.value.getContext('2d'), {
    type: 'doughnut',
    plugins: [ChartDataLabels],
    data: {
      labels: ['Total Number that have a target activity', 'Total Number that dont have a target activity'],
      datasets: [
        {
          label: '',
          data: dataset.value,
          cubicInterpolationMode: 'monotone',
          tension: 1,
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
          datalabels: { anchor: 'center', align: 'center' },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      //   indexAxis: 'x',
      //   //   layout: {
      //   //     padding: 5,
      //   //   },
      //   scales: {
      //     x: {
      //       grid: {
      //         drawOnChartArea: true,
      //       },
      //     },
      //     y: {
      //       grid: {
      //         drawOnChartArea: true,
      //       },
      //     },
      //   },
      plugins: {
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

watch([dataset.value], ([newDataset], [oldDataset]) => {
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
  <div class="m-auto w-[52vw] max-md:w-full lg:w-[45vw]">
    <canvas ref="chartCanva" style="height: 420px"> </canvas>
  </div>
</template>
