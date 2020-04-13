import { cards } from '@/data/cards'
import { Column } from '@/enums/Column'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Board } from '@/models/Board'
import { Cell, Grid } from '@/models/Cell'
import { Piece } from '@/models/Piece'

const newCell = (row: Row, column: Column): Cell => {
  let piece: Piece | null = null
  switch (row) {
    case Row.One:
      piece = {
        player: Player.Player1,
        type: column === Column.C ? PieceType.Master : PieceType.Student
      }
      break
    case Row.Five:
      piece = {
        player: Player.Player2,
        type: column === Column.C ? PieceType.Master : PieceType.Student
      }
      break
  }

  return { row, column, piece, selected: false }
}

const selectCards = () => {
  const shuffledCards = [...cards]
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = shuffledCards[i]
    shuffledCards[i] = shuffledCards[j]
    shuffledCards[j] = temp
  }
  const [
    firstCard,
    secondCard,
    thirdCard,
    fourthCard,
    fifthCard
  ] = shuffledCards
  return [firstCard, secondCard, thirdCard, fourthCard, fifthCard]
}

export const initBoard = (user: string): Board => {
  const grid: Grid = [
    [
      newCell(Row.Five, Column.A),
      newCell(Row.Five, Column.B),
      newCell(Row.Five, Column.C),
      newCell(Row.Five, Column.D),
      newCell(Row.Five, Column.E)
    ],
    [
      newCell(Row.Four, Column.A),
      newCell(Row.Four, Column.B),
      newCell(Row.Four, Column.C),
      newCell(Row.Four, Column.D),
      newCell(Row.Four, Column.E)
    ],
    [
      newCell(Row.Three, Column.A),
      newCell(Row.Three, Column.B),
      newCell(Row.Three, Column.C),
      newCell(Row.Three, Column.D),
      newCell(Row.Three, Column.E)
    ],
    [
      newCell(Row.Two, Column.A),
      newCell(Row.Two, Column.B),
      newCell(Row.Two, Column.C),
      newCell(Row.Two, Column.D),
      newCell(Row.Two, Column.E)
    ],
    [
      newCell(Row.One, Column.A),
      newCell(Row.One, Column.B),
      newCell(Row.One, Column.C),
      newCell(Row.One, Column.D),
      newCell(Row.One, Column.E)
    ]
  ]

  const cards = selectCards()
  const [firstCard, secondCard, thirdCard, fourthCard] = cards
  const player1Cards = [firstCard, secondCard]
  const player2Cards = [thirdCard, fourthCard]

  return {
    grid,
    turn: Player.Player1,
    cards,
    selectedCard: null,
    selectedCell: null,
    playerCards: {
      [Player.Player1]: player1Cards,
      [Player.Player2]: player2Cards
    },
    users: {
      [Player.Player1]: user,
      [Player.Player2]: null
    }
  }
}
