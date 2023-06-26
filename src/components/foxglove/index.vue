<template>
    <div>123</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { useFoxgloveSocket } from '@/hooks/useFoxgloveSocket';

import { rosNumber } from "@/data/foxgloveConfig";

const linkUrl = `${import.meta.env.VITE_API_FOXGLOVE_SOCKET}?rosNumber=${encodeURIComponent(rosNumber)}`;
const startConnectTime = moment().format('YYYY-MM-DD HH:mm:ss');

const player = useFoxgloveSocket(linkUrl, rosNumber)


</script>

<style scoped lang="scss"></style>