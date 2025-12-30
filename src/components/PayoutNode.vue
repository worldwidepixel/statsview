<template>
  <div class="revenue_container">
    <span class="revenue_date">{{ RELATIVE_TIME.format(new Date((time ?? 0) * 1000)) }}</span>
    <span>Total Revenue: {{ USD.format((platformRevenue ?? 0) + (creatorRevenue ?? 0)) }}</span>
    <span>Creator Revenue: {{ USD.format(creatorRevenue ?? 0) }}</span>
    <span>Platform Revenue: {{ USD.format((platformRevenue ?? 0)) }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  time: Number,
  platformRevenue: Number,
  creatorRevenue: Number
})

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const RELATIVE_TIME = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })
</script>
