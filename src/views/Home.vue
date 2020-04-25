<template>
  <div class="home">
    <h1 class="title is-1">
      <span class="onitama">Onitama</span>
    </h1>
    <div class="buttons is-centered">
      <BoardNew />
    </div>
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Play against Zhuge Liang?
          </h1>
          <!-- <img src="../assets/zhuge-liang.jpg" alt="" /> -->
          <div class="buttons is-centered">
            <BoardNew play-against-a-i="zhuge" />
            <router-link class="button is-primary is-light" to="/board-training"
              >display training</router-link
            >
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-danger is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Play against Sima Yi?
          </h1>
          <div class="buttons is-centered">
            <BoardNew play-against-a-i="sima" />
          </div>
        </div>
      </div>
    </section>
    <BoardUserList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BoardNew from '@/components/Board/BoardNew.vue'
import BoardUserList from '@/components/Board/BoardUserList.vue'

@Component({
  components: {
    BoardNew,
    BoardUserList
  }
})
export default class Home extends Vue {}
</script>
