<script setup>
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import canopy from '../../img/image (27).JPG'

const plates = [
  { src: canopy, title: '树冠之下', alt: '阳光穿过繁茂的树冠，两个人坐在粗壮的枝头。' },
  { src: '/images/hero-mountain.jpg', title: '暮色群山', alt: '橘红色的晚霞笼罩着远处层叠的山脊。' },
  { src: '/images/cover-notes.jpg', title: '花树旁的小屋', alt: '一座小屋立在开满粉紫色花朵的大树旁，远处是连绵的青山。' },
]
const index = ref(0)

function turnPage(step) {
  index.value = (index.value + step + plates.length) % plates.length
}
</script>

<template>
  <div class="cover">
    <figure class="print" aria-label="花园画页">
      <img class="artwork" :src="plates[index].src" :alt="plates[index].alt" width="1920" height="945" fetchpriority="high" />
      <figcaption>
        <span class="caption" aria-live="polite">
          <ImageIcon :size="14" aria-hidden="true" />
          {{ plates[index].title }}
        </span>
        <div class="controls">
          <span class="counter">{{ String(index + 1).padStart(2, '0') }} <i>/</i> {{ String(plates.length).padStart(2, '0') }}</span>
          <button type="button" aria-label="上一幅插画" @click="turnPage(-1)"><ChevronLeft :size="15" /></button>
          <button type="button" aria-label="下一幅插画" @click="turnPage(1)"><ChevronRight :size="15" /></button>
        </div>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  z-index: 0;
  margin: 0 5px 0 0;
}
.cover::before {
  content: '';
  position: absolute;
  inset: 3px 1px 0;
  z-index: -1;
  border: 1px solid #c8cbb9;
  background: #e2e5d6;
  transform: rotate(-2deg);
}
.print {
  position: relative;
  margin: 0;
  padding: 10px 10px 0;
  border: 1px solid #d4d5ca;
  background: #fffef8;
  box-shadow: 0 4px 10px #343c2910;
  transform: rotate(1deg);
}
.print::before {
  content: '';
  position: absolute;
  z-index: 1;
  top: -10px;
  left: calc(50% - 41px);
  width: 82px;
  height: 23px;
  background: #dccca5b5;
  transform: rotate(-6deg);
  clip-path: polygon(1% 3%, 99% 1%, 98% 25%, 100% 43%, 98% 71%, 100% 96%, 0 100%, 2% 76%, 0 58%, 2% 33%);
}
.artwork {
  width: 100%;
  height: auto;
  aspect-ratio: 1.88;
  object-fit: cover;
  object-position: center 40%;
  background: #d3d8cc;
}
figcaption, .caption, .controls { display: flex; align-items: center; }
figcaption { justify-content: space-between; gap: 10px; padding: 6px 3px; }
.caption { gap: 8px; color: #515b4d; font: 14px/1.5 var(--journal-serif); letter-spacing: .08em; }
.caption svg { color: #687461; }
.controls { gap: 3px; }
.counter { margin-right: 8px; font: 11px/1.5 ui-monospace, Consolas, monospace; letter-spacing: .04em; color: #515e50; }
.counter i { color: #888f80; margin: 0 2px; font-style: normal; }
button {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  color: #405541;
  background: transparent;
}
button:hover, button:focus-visible { background: #e9edde; }
@media (max-width: 580px) {
  .print { padding: 6px 6px 0; }
  .print::before { width: 65px; height: 19px; left: calc(50% - 32px); }
  figcaption { padding: 2px 3px; }
  .caption { font-size: 13px; }
}
</style>
