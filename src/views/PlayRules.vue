<template>
  <div class="play-rules">
    <h1 class="title is-1"><span class="onitama">Onitama</span>'s rules</h1>
    <p>
      <span class="onitama">Onitama</span> is an elegant and simple game which
      captures the essence of martial arts.. Each game is quick, usually 15
      minutes in length.
    </p>
    <p>
      For full explanation, take a look at the
      <a
        href="http://www.arcanewonders.com/resources/Onitama_Rulebook.PDF"
        target="_blank"
        rel="noopener noreferrer"
        >official rules</a
      >.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PlayRules extends Vue {}
</script>

<style scoped lang="scss">
.play-rules {
  font-size: 1.4rem;
  p {
    max-width: 50vw;
    text-align: justify;
    margin: auto;
  }
}
</style>
