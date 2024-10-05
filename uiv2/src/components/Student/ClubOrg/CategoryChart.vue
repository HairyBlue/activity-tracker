<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted, watch } from 'vue';

const chartCanva = ref<any>();
const props = defineProps(['category']);

const propsData = props.category;
const label = ref<string[]>([]);
const dataset = ref<number[]>([]);

function designateProps() {
   label.value = Object.keys(propsData);
   dataset.value = Object.values(propsData);
   // console.log("FROM PROPS", propsData)
   // console.log(label.value, dataset.value)
}

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
          // backgroundColor: [
          //   'rgba(255, 99, 132, 0.2)',
          //   'rgba(255, 159, 64, 0.2)',
          //   'rgba(255, 205, 86, 0.2)',
          //   'rgba(75, 192, 192, 0.2)',
          //   'rgba(54, 162, 235, 0.2)',
          //   'rgba(153, 102, 255, 0.2)',
          //   'rgba(201, 203, 207, 0.2)',
          // ],
          // borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
          borderWidth: 2,
          datalabels: { anchor: 'start', align: 'end' },
        },
      ],
    },
    options: {
      layout: {
        padding: 20
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            // color: 'rgb(255, 99, 132)',
            padding: 10,
            font: {
              size: 18,
              weight: 600
            },         
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

watch([label, dataset], ([newLabel, newDataset], [oldLabel, oldDataset]) => {
  if (newLabel !== oldLabel && newDataset !== oldDataset) {
    label.value = newLabel;
    dataset.value = newDataset;
    createChart();
  }
});

onMounted(() => {
   designateProps()
    
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
    <canvas ref="chartCanva"> </canvas>
  </div>
</template>