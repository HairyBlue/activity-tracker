<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted, watch } from 'vue';

const chartCanva = ref<any>();
const props = defineProps(['label', 'dataset']);
const label = ref<any>(props.label);
const dataset = ref<any>(props.dataset);
let chartInstance: any;

function createChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }
  Chart.defaults.font.size = 12;
  chartInstance = new Chart(chartCanva.value.getContext('2d'), {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
      labels: label.value,
      datasets: [
        {
          label: 'Number of activity per category',
          data: dataset.value,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
          borderWidth: 1,
          datalabels: { anchor: 'start', align: 'end' },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      //   layout: {
      //     padding: 5,
      //   },
    },
  });
}

watch([props.label, props.dataset], ([newLabel, newDataset], [oldLabel, oldDataset]) => {
  if (newLabel !== oldLabel && newDataset !== oldDataset) {
    label.value = newLabel;
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
  <div class="card h-[60vh] w-[92vw] p-12">
    <h2 class="text-center text-xl font-semibold"><slot></slot></h2>
    <canvas ref="chartCanva"> </canvas>
  </div>
</template>
