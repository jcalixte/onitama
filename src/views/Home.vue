<template>
  <div class="home">
    <h1 class="title is-1">onitama</h1>
    <div class="buttons is-centered">
      <BoardNew />
      <router-link class="button is-primary is-light" to="/board-training"
        >display training</router-link
      >
    </div>
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Play against Zhuge Liang?
          </h1>
          <!-- <img src="../assets/zhuge-liang.jpg" alt="" /> -->
          <BoardNew :play-against-a-i="true" />
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
