<template>
  <div class="board-training-list">
    <div v-if="loading" class="loading">
      <i class="gg-loadbar-alt"></i>
    </div>
    <div v-else-if="!loading && boards.length">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { repository } from '@/services/repository'
import { Board } from '@/models/Board'

@Component({
  components: {
    BoardUserListItem: () => import('@/components/Board/BoardUserListItem.vue')
  }
})
export default class BoardTrainingList extends Vue {
  private boardByDate: [string, Board[]][] = []
  private boards: Board[] = []
  private loading = true

  public async mounted() {
    this.boards = await repository.getTrainingDocuments()
    const boardByDate: Map<string, Board[]> = new Map()
    this.boards.forEach((board) => {
      const date = new Date(board.date).toLocaleDateString()
      const oldArray = boardByDate.get(date)
      boardByDate.set(date, [...(oldArray || []), board])
    })
    this.boardByDate = Array.from(boardByDate)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}
</style>
