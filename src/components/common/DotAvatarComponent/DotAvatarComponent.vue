<template>
  <span
    :style="{
      backgroundColor: color,
      transform: `rotate(${radialPosition - 90}deg) translateX(30px)`,
    }"
  />
</template>
<script>
export default {
  name: "DotAvatarComponent",
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
  width: $size;
  height: $size;
  border-radius: 50%;
  transition: transform .3s ease;
  z-index: 0;
}
</style>
