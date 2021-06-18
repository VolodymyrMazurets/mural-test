<template>
  <span
    :style="{
      borderLeftColor: color,
      transform: `rotate(${radialPosition - 90}deg) translateX(32px)`
      }"
  />
</template>
<script>
export default {
  name: "ArrowAvatarComponent",
  props: {
    color: {
      type: String,
      default: "currentColor",
    },
    radialPosition: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="scss" scoped>
$size: 6px;
span {
  display: block;
  border-width: $size;
  border-style: solid;
  border-right-color: transparent;
  border-top-color: transparent;
  border-bottom-color: transparent;
  transition: transform .3s ease;
  z-index: 0;
}
</style>
