<!--
一个简单的 markdown 编辑器。
-->

<script setup>
import {marked} from 'marked'
import {debounce} from 'lodash-es'
import {computed} from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const output = computed(() => marked(props.modelValue))

const update = debounce((e) => {
  emit('update:modelValue', e.target.value)
}, 100)
</script>

<template>
  <div class="editor">
    <textarea :value="props.modelValue" class="input" @input="update"></textarea>
    <div class="output" v-html="output"></div>
  </div>
</template>

<style>
body {
  margin: 0;
}

.editor {
  height: 40vh;
  display: flex;
}

.input,
.output {
  overflow: auto;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.input {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>