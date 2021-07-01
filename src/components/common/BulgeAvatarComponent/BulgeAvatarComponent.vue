<template>
  <span
    :style="{
      background: `linear-gradient(to left,${color}  50%, transparent 50%)`,
      transform: `rotate(${radialPosition}rad) translateX(9px)`,
    }"
  />
</template>
<script>
export default {
  name: "BulgeAvatarComponent",
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
$size: 50px;
span {
  display: block;
  width: $size;
  height: $size + 4px;
  transition: transform 0.3s ease;
  border-radius: 0% 100% 100% 0% / 0% 50% 50% 0%;
  z-index: 1;
}
</style>
