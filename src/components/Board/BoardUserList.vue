<template>
  <div class="board-user-list" v-if="boards.length">
    <hr />
    <h3 class="subtitle is-3">boards played</h3>
    <ul class="board-user-list">
      <li v-for="board in boards" :key="board._id">
        <BoardUserListItem :board="board" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { repository } from '@/services/repository'
import { Board } from '@/models/Board'

@Component({
  components: {
    BoardUserListItem: () => import('@/components/Board/BoardUserListItem.vue')
  }
})
export default class BoardUserList extends Vue {
  @Getter
  private user!: string
  private boards: Board[] = []

  public async mounted() {
    if (this.user) {
      this.boards = await repository.getUserDocument(this.user)
    }
  }
}
</script>
