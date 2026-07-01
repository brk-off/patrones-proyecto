<!-- src/components/ui/ContextMenu.vue -->

<script setup>

import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        default: () => [], // [{ label: 'Editar', action: 'edit' }, { label: 'Eliminar', action: 'delete', danger: true }]
    },
})

const emit = defineEmits(['select', 'close'])

const visible = ref(false)
const x = ref(0)
const y = ref(0)
const target = ref(null)


function open(event, payload) {
    event.preventDefault()
    target.value = payload
    x.value = event.clientX
    y.value = event.clientY
    visible.value = true

    // UBICACIÓN AJUSTADA PARA EL RENDER (NO LO HICE YO XD)
    nextTick(() => {
        adjustPosition()
    })
}
// UBICACIÓN AJUSTADA PARA EL RENDER
function adjustPosition() {
  const menu = document.querySelector('.context-menu')
  if (!menu) return

  const { innerWidth, innerHeight } = window
  const rect = menu.getBoundingClientRect()

  // Ajustar horizontal si se sale de la pantalla
  if (rect.right > innerWidth) {
    x.value -= rect.right - innerWidth + 8 // +8px de margen
  }

  // Ajustar vertical si se sale de la pantalla
  if (rect.bottom > innerHeight) {
    y.value -= rect.bottom - innerHeight + 8
  }
}

function close() {
    visible.value = false
    target.value = null
    emit('close')
}

function onSelect(item) {
    emit('select', { action: item.action, target: target.value })
    console.log("emit emitido en onSelect() de ContextMenu.vue");
    console.log("action: ", item.action);
    console.log("taget: ", target.value);
    close()
}

function onClickOutside() {
    if (visible.value) close()
}
function onKeydown(e) {
    if (e.key === 'Escape') close()
}


onMounted(() => {
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onKeydown)
})


defineExpose({ open, close })
</script>

<template>
  <Teleport to="body">
    <ul
      v-if="visible"
      class="context-menu"
      :style="{ top: `${y}px`, left: `${x}px` }"
      @click.stop
    >
      <li
        v-for="item in items"
        :key="item.action"
        :class="{ danger: item.danger }"
        @click="onSelect(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </Teleport>
</template>

<style scoped>

.context-menu{
    position: absolute;
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;

    overflow: hidden;
    list-style: none;
}

.context-menu li{
    background: none;
    border: none;
    padding: 8px 16px;
    text-align: left;
    cursor: pointer;
}
.context-menu li:hover {
    background-color: var(--bg-card-hover);
}

.context-menu li.danger{
    background-color: var(--danger);
}
.context-menu li.danger:hover {
    background-color: var(--danger-hover);
}

</style>
