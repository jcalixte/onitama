import { Card, PartialCard } from '@/models/Card'
import { Animal } from '@/enums/Animal'
import { Player } from '@/enums/Player'
import { CardMove } from '@/models/CardMove'

const partialCards: PartialCard[] = [
  {
    animal: Animal.Tiger,
    description: `The power of your Art projects itself like a shadow.
    Sense your opponent's fear, and pounce with certainty and strength`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 0,
        vertical: 2
      },
      {
        horizontal: 0,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Dragon,
    description: `Be swift as the thunder that peals before you have a chance to cover you ears,
    fast as the lightning that flashes before you can blink you eyes.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -2,
        vertical: 1
      },
      {
        horizontal: 2,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Frog,
    description: `Do not fail to learn from the pure voice of an ever flowing mountain stream splashing over the rocks.
    Emulate its flow, mimic its power.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -2,
        vertical: 0
      },
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Rabbit,
    description: `Be near to your opponent, blinding him with your speed.
    The art of the Rabbit is the Art of speed.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: 2,
        vertical: 0
      }
    ]
  },
  {
    animal: Animal.Crab,
    description: `Move with your opponent's movements, as if you are the never-ceasing tide.
    When the time is right, be wild fall prey to your attack.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -2,
        vertical: 0
      },
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: 2,
        vertical: 0
      }
    ]
  },
  {
    animal: Animal.Elephant,
    description: `Only the strong may pursue your Art.
    This is why it is the true Art, the Art that cannot be stopped.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 1
      }
    ]
  },
  {
    animal: Animal.Goose,
    description: `Your robes are your cloak; spread your wings to hide your intentions.
    Even then, as your opponent seeks to determine your motive, you shall strike.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Rooster,
    description: `Do not allow your ennemy to rest,
    but focus your Art to deliver quick,
    sharp strikes whenever he lags.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 1
      }
    ]
  },
  {
    animal: Animal.Monkey,
    description: `Without deception you cannot carry out Strategy,
    without strategy your cannot control the opponent.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Mantis,
    description: `Your opponent sees, but does not understand.
    Distract the watchfull, misguide the wary.
    This is Art of the Mantis, the Art of the deceptive strike.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: 0,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Horse,
    description: `Lose yourself in the rhythm of your Art.
    At times be swift and decisive, at other times measered and taunting.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: 0,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Ox,
    description: `Pour your strength into the forms of your Art –
    in its punches, its kicks, in the steady advance of your aggresion.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: 0
      },
      {
        horizontal: 0,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Crane,
    description: `Make no unnecessary movement,
    conserving your strength until the time is right to strike.
    The true Art is a symphony of graceful strikes.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Boar,
    description: `Watch the opportunity, for it will present itself.
    Then strike, focusing all your might into a single rush,
    trampling your opponent's Art under your own.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: 0
      }
    ]
  },
  {
    animal: Animal.Eel,
    description: `if your opponent strikes with fire,
    counter with water, becoming completely fluid and freeflowing.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: 1,
        vertical: 0
      }
    ]
  },
  {
    animal: Animal.Cobra,
    description: `Attack violently when your opponents are not expecting it –
    show leisure in the beginning, then suddenly attack vigorously.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Fox,
    description: `Harry your opponent through your Art,
    give him no time think, less time to act.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: -1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Dog,
    description: `Deny your opponent his Art. Once you have blocked his attack,
    do not let him go, but instead, relentlessly hamper his momentum.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Giraffe,
    description: `Project your power, vaulting at opponent's who believe themselves
    safely out of range. Aggression is subservient to suprise.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -2,
        vertical: 1
      },
      {
        horizontal: 2,
        vertical: 1
      },
      {
        horizontal: 0,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Panda,
    description: `Your opponent watches for your complacency, so show it to him.
    Lull him in an attack, then unleash your Art when he has already commited to his attack`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Bear,
    description: `Defend your ground. Do not be like those fools who
    are quick to run to attack from another position. They have lost the fight
    because they have already run from it.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Kirin,
    description: `There is Art in grace, Art in discernment, Art in sensing the truth.
    Pierce the veil of the shadow, and strike your opponent from a place of enlightenment.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 1,
        vertical: 2
      },
      {
        horizontal: -1,
        vertical: 2
      },
      {
        horizontal: 0,
        vertical: -2
      }
    ]
  },
  {
    animal: Animal.SeaSnake,
    description: `There is no movement or opportunity wasted.
    Strike where you are not expected, flow where your opponent
    believes you can not`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -2,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Viper,
    description: `The Art of the Viper is to strike in the Moment. This is the true Art.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: 2,
        vertical: 0
      },
      {
        horizontal: -1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Phoenix,
    description: `No opponent expects that which he believes is not there.
    Harness the shadows, bend the sun, strike as the wind – from a place unseen.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 2,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: -2,
        vertical: 0
      }
    ]
  },
  {
    animal: Animal.Mouse,
    description: `All opponents have a hole in their Art, an opening of weakness.
    The Art of the Mouse si to find that opening, enter it, and strike`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Rat,
    description: `Your opponent cannot attack what he cannot predict.
    Let your movements be immediate, your attacks be unexpected.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: 0
      },
      {
        horizontal: -1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Turtle,
    description: `Within your sphere of power, your Art remains supreme.
    Engage your opponent, and deflect his strikes.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 2,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: -1
      },
      {
        horizontal: -1,
        vertical: -1
      },
      {
        horizontal: -2,
        vertical: 0
      }
    ]
  },
  {
    animal: Animal.Tanuki,
    description: `The Art of the Tanuki is the art of opportunity.
    Patience will open the door to the perfect angle of your strike.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -2,
        vertical: 1
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Iguana,
    description: `While your opponent wears himself out with
    unnecessary movement, you will gather your strength.
    A devastating sweep or fatal punch is the pinnacle of the Art.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 2,
        vertical: 1
      },
      {
        horizontal: 0,
        vertical: 1
      },
      {
        horizontal: -1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Sable,
    description: `Be fluid, and control the battlefield with constant
    movement and precision strikes.`,
    player: Player.Player1,
    moves: [
      {
        horizontal: -1,
        vertical: 1
      },
      {
        horizontal: 2,
        vertical: 0
      },
      {
        horizontal: 1,
        vertical: -1
      }
    ]
  },
  {
    animal: Animal.Otter,
    description: `Who can stop the flowing stream? The Art of the Otter is
    the Art of Power, knocking away the advances of the opponent through
    sustained, powerful strikes.`,
    player: Player.Player2,
    moves: [
      {
        horizontal: 1,
        vertical: 1
      },
      {
        horizontal: -2,
        vertical: 0
      },
      {
        horizontal: -1,
        vertical: -1
      }
    ]
  }
]

const reverseMove = (move: CardMove): CardMove => ({
  horizontal: -1 * move.horizontal,
  vertical: -1 * move.vertical
})

export const cards: Card[] = partialCards.map((partialCard) => ({
  ...partialCard,
  reverseMoves: partialCard.moves.map(reverseMove)
}))
