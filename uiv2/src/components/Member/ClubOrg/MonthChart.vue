<script setup lang="ts">
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, onUnmounted, watch } from 'vue';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 

const chartCanva2 = ref<any>(null);
const props = defineProps(['months', 'selected']);
const selected = ref<string>(props.selected);

function designateProps() {
  const rawMonths = props.months;
  const newRaw: any = Object.assign({}, rawMonths);

  for (let data in newRaw) {
    const each = newRaw[data];
   
    if (each.length == 0) {
      newRaw[data]= new Array(12).fill(0);

    } else {
      let newEach: number[] = new Array(12).fill(0);
     
      for (let e of each) {
       
        const idx = e - 1;
        newEach[idx]+=1;
      }

      newRaw[data] = newEach;
    }
  }

  const val: any = [];

  for (let pd in newRaw) {
    let obj: any = {
      label: pd,
      data: newRaw[pd],
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderWidth: 1,
      datalabels: { anchor: 'end', align: 'end' },
    };

    val.push(obj);
  }

  return val;
}

let chartInstance: any;

function createChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  Chart.defaults.font.size = 12;

  const beforeInitPlugin: any = {
			beforeInit(chart: any) {
				const originalFit = chart.legend.fit;
				chart.legend.fit = function fit() {
					originalFit.bind(chart.legend)();
					this.height += 20;
				}
			}
		}

  chartInstance = new Chart(chartCanva2.value.getContext('2d'), {
    type: 'bar',
    plugins: [
      ChartDataLabels,
      beforeInitPlugin
    ],
    data: {
      labels: MONTHS,
      datasets: designateProps(),
    },
    options: {
      layout: {
        padding: 20,
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            // color: 'rgb(255, 99, 132)',
            padding: 10,
            font: {
              size: 12,
              weight: 600
            },         
          },
        },
      },
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
    },
  });
}

watch([selected], ([newSelected], [oldSelected]) => {
  if (newSelected !== oldSelected) {
    createChart();
  }
});

onMounted(() => {
  createChart();

  designateProps()
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="h-[400px]">
    <canvas ref="chartCanva2"> </canvas>
  </div>
</template>
