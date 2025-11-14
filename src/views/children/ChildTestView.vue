<template>
  <Table :columns="columns" :data="children" border />
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { Table } from '@arco-design/web-vue';

const children = ref([
  { id: 1, name: '李华', gender: 'female' },
  { id: 2, name: '张明', gender: 'male' },
]);

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    render: ({ value }: { value: string }) => {
        console.log('value', value);
        const genderText = value === 'male' ? '男' : '女';
        return h('span', { style: { color: 'blue' } }, genderText);
    }
  },
];
</script>