<template>
  <div class="play-rules">
    <h1 class="title is-1"><span class="onitama">Onitama</span>'s rules</h1>
    <div class="columns is-centered">
      <div class="column is-half">
        <p>
          <span class="onitama">Onitama</span> is an elegant and simple game
          which captures the essence of martial arts.. Each game is quick,
          usually 15 minutes in length.
        </p>
      </div>
    </div>
    <a href="http://www.arcanewonders.com/resources/Onitama_Rulebook.PDF"
      >Official rules</a
    >
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
    text-align: justify;
  }
}
</style>
