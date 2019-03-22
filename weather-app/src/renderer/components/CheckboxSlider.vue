<template>
  <div class="on-toggle">
    <label class="switch">
      <!-- <input @click="$emit('input-click')" v-bind:value="value" @input="$emit('input', $event.target.value)" type="checkbox"> -->
      <input v-model="value" :value="name" type="checkbox">
      <span class="slider"></span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'CheckboxSlider',
    props: ['value', 'name'],
  };
</script>
