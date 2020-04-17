<template>
  <div class="board-user-list" v-if="boards.length">
    <h3 class="subtitle is-3">boards played</h3>
    <ul v-for="[date, boards] in boardByDate" :key="date">
      <h4 class="title is-4">{{ date }}</h4>
      <ul class="board-user-list">
        <li v-for="board in boards" :key="board._id">
          <BoardUserListItem :board="board" />
        </li>
      </ul>
      <br />
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
  private boardByDate: [string, Board[]][] = []
  private boards: Board[] = []

  public async mounted() {
    if (this.user) {
      this.boards = await repository.getUserDocument(this.user)
      const boardByDate: Map<string, Board[]> = new Map()
      this.boards.forEach((board) => {
        const date = new Date(board.date).toLocaleDateString()
        const oldArray = boardByDate.get(date)
        boardByDate.set(date, [...(oldArray || []), board])
      })
      this.boardByDate = Array.from(boardByDate)
    }
  }
}
</script>
