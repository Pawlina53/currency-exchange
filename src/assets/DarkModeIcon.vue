<template>
    <svg @click="onClick" :fill="color" :class="className" :width="width" :height="height" :style="style" version="1.1" id="dark-mode" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 512 512" xml:space="preserve">
    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
      stroke="none">
      <path d="M2355 4388 c-624 -70 -1181 -466 -1450 -1030 -244 -513 -246 -1079
      -4 -1588 317 -665 996 -1076 1729 -1047 807 33 1480 565 1704 1347 30 107 54
      248 62 370 6 88 5 97 -16 123 -16 20 -30 27 -57 27 -32 0 -48 -12 -142 -103
      -58 -56 -138 -124 -178 -150 -583 -387 -1356 -208 -1711 398 -172 293 -205
      664 -91 993 61 174 148 310 298 465 81 84 94 102 93 130 -1 21 -9 39 -27 55
      -29 25 -67 27 -210 10z"/>
    </g>
    </svg>
</template>

<script>
  export default {
    props: {
      width: [String],
      height: [String],
      color: [String],
      style: {},
      className: [String],
      onClick: () => {}
    },
  }
  </script>