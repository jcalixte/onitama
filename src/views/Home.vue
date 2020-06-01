<template>
  <div class="home">
    <h1 class="title is-1">
      <span class="onitama">Onitama</span>
    </h1>
    <div class="buttons is-centered">
      <BoardNew />
    </div>
    <div class="columns is-centered">
      <div class="column is-one-third">
        <section class="hero is-primary is-bold">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">
                Play against Zhuge Liang
              </h1>
              <!-- <img src="../assets/zhuge-liang.jpg" alt="" /> -->
              <div class="buttons is-centered">
                <BoardNew play-against-a-i="zhuge" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="column is-one-third">
        <section class="hero is-warning is-bold">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">
                Play against Sima Yi
              </h1>
              <div class="buttons is-centered">
                <BoardNew play-against-a-i="sima" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- <router-link class="button is-primary is-light" to="/board-training">
      display bot training
    </router-link> -->
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
