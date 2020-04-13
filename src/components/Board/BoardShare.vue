<template>
  <div class="board-share">
    <article class="board-share message is-success is-medium">
      <div class="message-header">
        <p>Share this board to play!</p>
      </div>
      <div class="message-body">
        <button
          class="button is-primary is-medium"
          @click="share"
          v-if="canShareAPI"
        >
          Partager
        </button>
        <div class="field is-grouped is-grouped-centered" v-else>
          <div class="field" :class="{ 'has-addons': canClipboard }">
            <div class="control">
              <input class="input" type="text" readonly :value="boardUrl" />
            </div>
            <div class="control" if="canClipboard">
              <a href="#" class="button is-primary" @click.prevent="copy"
                >Copier</a
              >
            </div>
          </div>
        </div>
        <div class="qr-code">
          <p>ou via ce QR code :</p>
          <qrcode :value="boardUrl" />
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const navigator: any
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BoardShare extends Vue {
  private share(): void {
    if (this.canShareAPI) {
      navigator.share({
        title: `Onitama`,
        text: `You are invited to play a game of Onitama!`,
        url: this.boardUrl
      })
    }
  }

  private async copy(): Promise<void> {
    if (this.canClipboard) {
      await navigator.clipboard.writeText(this.boardUrl)
    }
  }

  private get boardUrl(): string {
    return window.location.href
  }
  private get canShareAPI(): boolean {
    return !!navigator.share
  }

  private get canClipboard(): boolean {
    return !!navigator.clipboard
  }
}
</script>
