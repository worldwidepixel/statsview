<template>
  <div class="statsContainer">
    <h1>{{ USD.format(total_revenue) }} paid to creators</h1>
    <a target="_blank" style="color: var(--color-text)" href="https://worldwidepixel.ca/blog/statsview-estimates">Why StatsView no longer provides estimates</a>
    <Line class="chart" v-if="loaded === true" :options="options" :data="chartData" />
    <div class="payout_grid">
      <PayoutNode
        v-for="node in data.data"
        :time="+node.time"
        :platform-revenue="+node.revenue"
        :creator-revenue="+node.creator_revenue"
        v-bind:key="node"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PayoutNode from '@/components/PayoutNode.vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  plugins
} from 'chart.js'
import { computed, ref } from 'vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const loaded = ref(false)
const requestUrl = ref(`https://api.modrinth.com/v3/payout/platform_revenue`)

const response = await fetch(requestUrl.value)
const data = await response.json()

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const TIME_FORMAT = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })

const total_revenue = data.all_time

const last_30d_payouts = data.data

let total_25_75_paid = 0

for (const node of last_30d_payouts) {
  if (new Date(node.time * 1000) > new Date('September 4, 2024 00:00:00')) {
    const revenue: number = +node.creator_revenue
    total_25_75_paid += revenue
  }
}

const total_90_10_paid: number = data.all_time - total_25_75_paid

const all_revenue = total_90_10_paid * 1.125 + total_25_75_paid * 1.25

// CHART

const chartInfo = computed(() => {
  let labelData = []
  let platformRevenueData = []
  let creatorRevenueData = []
  let totalRevenueData = []
  for (const datapoint of data.data) {
    labelData.push(TIME_FORMAT.format(new Date(datapoint.time * 1000)))
    platformRevenueData.push(datapoint.revenue)
    creatorRevenueData.push(datapoint.creator_revenue)
    totalRevenueData.push(Number(datapoint.revenue) + Number(datapoint.creator_revenue))
  }
  return {
    labels: labelData.reverse(),
    platformRevenue: platformRevenueData.reverse(),
    creatorRevenue: creatorRevenueData.reverse(),
    totalRevenue: totalRevenueData.reverse()
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      ticks: {
        callback: (val: any) => {
          return USD.format(val)
        }
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        font: {
          family: 'Inter'
        }
      }
    },
    tooltip: {
      titleFont: {
        family: 'Inter'
      },
      titleColor: '#000000',
      bodyFont: {
        family: 'Inter'
      },
      bodyColor: '#000000',
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#000000',
      boxPadding: 4,
      padding: 8
    }
  }
}

const chartData = {
  labels: chartInfo.value.labels,
  datasets: [
    {
      label: 'Creator Revenue',
      borderColor: '#db2156ff',
      backgroundColor: '#db2156ff',
      tension: 0,
      data: chartInfo.value.creatorRevenue
    },
    {
      label: 'Total Revenue',
      borderColor: '#43b34fff',
      backgroundColor: '#43b34fff',
      tension: 0,
      data: chartInfo.value.totalRevenue
    },
    {
      label: 'Platform Revenue',
      borderColor: '#28cbd4ff',
      backgroundColor: '#28cbd4ff',
      tension: 0,
      data: chartInfo.value.platformRevenue
    }
  ]
}

loaded.value = true
</script>
