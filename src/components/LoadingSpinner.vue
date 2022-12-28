<template>
  <div class="loading-spinner">
    <div class="loading-spinner__spinner">
      <div/>
      <div/>
      <div/>
      <div/>
      <div/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;

$size: 1em / 16 * 4;
.loading-spinner {
  &__spinner {
    margin: 2rem auto;
    position: relative;
    width: 2em;
    height: 2em;

    div {
      position: absolute;
      inset: 0 auto 0 auto;
      background: currentColor;
      width: $size;
      height: $size;
      top: 1em - $size / 2;
      border-radius: $size / 2;
    }

    @for $i from 0 through 4 {
      div:nth-child(#{$i + 1}) {
        left: (1em / 16 * 7) * $i;
        animation: anim 3s .4s * $i cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
      }
    }

    @keyframes anim {
      0% {
        top: 1em - $size / 2;
        height: $size;
      }
      30% {
        top: 0;
        height: 2em;
      }
      60%, 100% {
        top: 1em - $size / 2;
        height: $size;
      }
    }
  }
}
</style>
