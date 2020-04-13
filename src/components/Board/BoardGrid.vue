<template>
  <div class="board-grid" v-if="grid">
    <table>
      <tr v-for="(row, r) in grid" :key="r">
        <td v-for="(cell, c) in row" :key="c">
          <BoardCell :cell="cell" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Grid } from '@/models/Cell'
import BoardCell from '@/components/Board/BoardCell.vue'

@Component({
  components: {
    BoardCell
  }
})
export default class BoardGrid extends Vue {
  @Getter
  private grid!: Grid | null
}
</script>

<style scoped lang="scss">
.board-grid {
  table {
    margin: auto;
    border-collapse: collapse;

    td {
      border: 1px solid black;
    }
  }
}
</style>
