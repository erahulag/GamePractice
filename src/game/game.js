import {
  NUM_RESOURCES_END,
  RESOURCES,
  LARGEST_HERD_BONUS,
  BONUS_SELL_TOKEN,
} from "../constants";
import { GAME_NAME } from "../config.js";
import { MoveValidate } from "./moveValidation";

//Defining some Game constants here
let DECK_CONTENTS = {};
DECK_CONTENTS[RESOURCES.diamond] = 6;
DECK_CONTENTS[RESOURCES.gold] = 6;
DECK_CONTENTS[RESOURCES.silver] = 6;
DECK_CONTENTS[RESOURCES.silk] = 8;
DECK_CONTENTS[RESOURCES.spices] = 8;
DECK_CONTENTS[RESOURCES.leather] = 10;
DECK_CONTENTS[RESOURCES.camel] = 11;
DECK_CONTENTS = Object.freeze(DECK_CONTENTS);

const Error = (str) => {
  console.log("ERROR: " + str);
};

const shuffleDeck = (deck) => {
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
};

const getBonusTokenValue = (type, count) => {
  const ret = [];
  for (let i = 0; i < count; i++) {
    ret.push(type + Math.floor(Math.random() * Math.floor(3)));
  }
  return ret;
};

const evaluatePlayerBonus = ({ T3, T4, T5 }, camel) => {
  const bonus = {
    T3: getBonusTokenValue(BONUS_SELL_TOKEN.T3, T3),
    T4: getBonusTokenValue(BONUS_SELL_TOKEN.T4, T4),
    T5: getBonusTokenValue(BONUS_SELL_TOKEN.T5, T5),
    camel: camel,
  };
  const value = Object.values(bonus).reduce(
    (total, value) => value.reduce((t, v) => t + v, total),
    0
  );
  return { bonus, value };
};

const getWinner = (G) => {
  let board = {
    p0: {
      trades: G.players[0].trade_tokens,
      camel: [],
      cards: G.players[0].cards,
    },
    p1: {
      trades: G.players[1].trade_tokens,
      camel: [],
      cards: G.players[1].cards,
    },
    reason: "Score",
  };

  let p0Score = G.players[0].trade_tokens.reduce(
    (total, token) => total + token.value,
    0
  );
  let p1Score = G.players[1].trade_tokens.reduce(
    (total, token) => total + token.value,
    0
  );

  let p0Camels = G.players[0].cards.filter(
    (card) => card.type === RESOURCES.camel
  ).length;
  let p1Camels = G.players[1].cards.filter(
    (card) => card.type === RESOURCES.camel
  ).length;

  // Give out token for most camels
  if (p0Camels > p1Camels) {
    board.p0.camel = [LARGEST_HERD_BONUS];
    board.p1.camel = [];
  } else if (p1Camels > p0Camels) {
    board.p1.camel = [LARGEST_HERD_BONUS];
    board.p0.camel = [];
  } else {
    //TODO: Deal with a tie
  }
  const p0Bonus = evaluatePlayerBonus(G.players[0], board.p0.camel);
  board.p0.bonus = p0Bonus.bonus;
  p0Score += p0Bonus.value;

  const p1Bonus = evaluatePlayerBonus(G.players[1], board.p1.camel);
  board.p1.bonus = p1Bonus.bonus;
  p1Score += p1Bonus.value;

  const findWinnerByScore = () => {
    const findWinnerByBonus = () => {
      const findWinnerByTrade = () => {
        const findWinnerByCardsInHand = () => {
          board.reason = "More cards in hand";
          return G.players[0].cards.length > G.players[1].cards.length ? 0 : 1;
        };
        if (
          G.players[0].trade_tokens.length === G.players[1].trade_tokens.length
        )
          return findWinnerByCardsInHand();

        board.reason = "Sold more items";
        return G.players[0].trade_tokens.length >
          G.players[1].trade_tokens.length
          ? 0
          : 1;
      };
      const bt0 = G.players[0].T3 + G.players[0].T4 + G.players[0].T5;
      const bt1 = G.players[1].T3 + G.players[1].T4 + G.players[1].T5;
      if (bt0 === bt1) return findWinnerByTrade();

      board.reason = "Earned more number of Bonus coin";
      return bt0 > bt1 ? 0 : 1;
    };
    if (p0Score === p1Score) return findWinnerByBonus();
    board.reason = "Earned more points";
    return p0Score > p1Score ? 0 : 1;
  };

  let winner = findWinnerByScore();
  return {
    winner,
    scores: { 0: p0Score, 1: p1Score },
    board,
  };
};

const generateDeck = () => {
  let deck = [];
  let id = 0;
  Object.keys(DECK_CONTENTS).forEach((res) => {
    let count = DECK_CONTENTS[res];
    if (res === RESOURCES.camel) {
      count -= 3;
    }
    for (let i = 0; i < count; i++) {
      deck.push({
        id: id++,
        type: res,
      });
    }
  });
  deck = shuffleDeck(deck);
  for (let i = 0; i < 3; i++) {
    deck.push({
      id: id++,
      type: RESOURCES.camel,
    });
  }
  return deck;
};
export const UdaipurGame = {
  name: GAME_NAME,
  setup: () => {
    const deck = generateDeck();
    var start = {
      board: [],
      chat: [],
      tokens: {},
      players: {
        0: { trade_tokens: [], cards: [], T3: 0, T4: 0, T5: 0 },
        1: { trade_tokens: [], cards: [], T3: 0, T4: 0, T5: 0 },
      },
      deck: deck,
    };
    // First put the 3 camels at the top of the deck and then the remaining 2 cards
    for (let i = 0; i < 5; i++) {
      start.board.push(start.deck.pop());
    }
    start.tokens[RESOURCES.silk] = [1, 1, 2, 2, 3, 3, 5];
    start.tokens[RESOURCES.spices] = [1, 1, 2, 2, 3, 3, 5];
    start.tokens[RESOURCES.leather] = [1, 1, 1, 1, 1, 1, 2, 3, 4];
    start.tokens[RESOURCES.gold] = [5, 5, 5, 6, 6];
    start.tokens[RESOURCES.silver] = [5, 5, 5, 5, 5];
    start.tokens[RESOURCES.diamond] = [5, 5, 5, 7, 7];

    // Deal 5 cards in alternating order to each player
    for (let i = 0; i < 5; i++) {
      start.players[0].cards.push(start.deck.pop());
      start.players[1].cards.push(start.deck.pop());
    }
    // Adding deckSize so that the Deck can be stripped in the future
    // deckSize will get updated after turn onEnd
    start.deckSize = start.deck.length;
    return start;
  },
  //playerView: PlayerView.STRIP_SECRETS,
  moves: {
    takeOne: (G, ctx, id) => {
      // Only write to game state if its a valid move!
      const validMove = MoveValidate.takeOne(G, ctx, id);
      if (validMove.valid) {
        //Using slice to return new arrays rather than references
        const p = ctx.currentPlayer;
        let board = G.board.slice();
        let cardToTake = board.filter((card) => card.id === id)[0];
        let newPlayerCards = G.players[p].cards.slice();
        newPlayerCards.push(cardToTake);
        G.players[p].cards = newPlayerCards;
        if (G.deck.length > 0) {
          board.push(G.deck.pop());
          board = board.filter((card) => card.id !== cardToTake.id);
        }
        let actionString = `Player ${p} took one card (${cardToTake.type}) from the board.`;
        G.board = board;
        G.chat.push({ player: p, action: actionString, automated: true });
        ctx.events.endTurn();
      } else {
        return Error(validMove.message);
      }
    },
    takeMany: (G, ctx, takeIDs, replaceIDs) => {
      // Only write to game state if its a valid move!
      const validate = MoveValidate.takeMany(G, ctx, takeIDs, replaceIDs);
      if (validate.valid) {
        const p = ctx.currentPlayer;
        // Cards to remove from the deck
        const cardsToRemove = G.board.filter(
          (card) => takeIDs.includes(card.id) && card.type !== RESOURCES.camel //Cannot remove camels from the deck
        );

        // Deck after removing the cards
        let newBoard = G.board.filter((card) => !takeIDs.includes(card.id));
        const cardsToReplace = G.players[p].cards.filter((card) =>
          replaceIDs.includes(card.id)
        );
        let newPlayerCards = G.players[p].cards.filter(
          (card) => !replaceIDs.includes(card.id)
        );
        let actionString = `Player ${p} traded some cards from his hand to the board.`;
        newBoard.push(...cardsToReplace);
        newPlayerCards.push(...cardsToRemove);
        G.players[p].cards = newPlayerCards;
        G.board = newBoard;
        G.chat.push({ player: p, action: actionString, automated: true });
        ctx.events.endTurn();
      } else {
        return Error(validate.message);
      }
    },
    takeCamels: (G, ctx) => {
      const validMove = MoveValidate.takeCamels(G, ctx);
      if (validMove.valid) {
        const p = ctx.currentPlayer;
        let newPlayerCards = G.players[p].cards;
        let newBoard = G.board.filter((card) => card.type !== RESOURCES.camel);
        let camels = G.board.filter((card) => card.type === RESOURCES.camel);
        const numCamels = camels.length;
        let actionString = `Player ${p} took all the Camels from the board ( ${numCamels} Camels)`;
        while (camels.length > 0) {
          newPlayerCards.push(camels.pop());
        }
        for (let i = 0; i < numCamels; i++) {
          if (G.deck.length > 0) {
            newBoard.push(G.deck.pop());
          }
        }
        G.players[p].cards = newPlayerCards;
        G.board = newBoard;
        console.log("Ending turn");
        G.chat.push({ player: p, action: actionString, automated: true });
        ctx.events.endTurn();
      } else {
        return Error(validMove.message);
      }
    },
    trade: (G, ctx, tradeIDs) => {
      const validMove = MoveValidate.trade(G, ctx, tradeIDs);
      // Only write to game state if its a valid move!
      if (validMove.valid) {
        const p = ctx.currentPlayer;
        const cardsToTrade = G.players[p].cards.filter((card) =>
          tradeIDs.includes(card.id)
        );
        const newPlayerCards = G.players[p].cards.filter(
          (card) => !tradeIDs.includes(card.id)
        );
        const cardType = cardsToTrade[0].type;
        let tradeSize = cardsToTrade.length;
        for (let i = 0; i < tradeSize; i++) {
          G.players[p].trade_tokens.push({
            resource: cardType,
            value: G.tokens[cardType].pop(),
          });
        }
        let actionString = `Player ${p} sold ${tradeSize} of their ${cardType} card(s) `;

        if (tradeSize === 3) {
          G.players[p].T3 += 1;
          actionString += `and was awarded a '3Cards Bonus Token'`;
        } else if (tradeSize === 4) {
          G.players[p].T4 += 1;
          actionString += `and was awarded a '4Cards Bonus Token'`;
        } else if (tradeSize >= 5) {
          G.players[p].T5 += 1;
          actionString += `and was awarded a '5Cards Bonus Token'`;
        }
        G.players[p].cards = newPlayerCards;
        G.chat.push({ player: p, action: actionString, automated: true });
        ctx.events.endTurn();
      } else {
        return Error(validMove.message);
      }
    },
  },
  turn: {
    onEnd: (G, ctx) => {
      //Update states here like deck size
      G.deckSize = G.deck.length;
    },
  },
  endIf: (G, ctx) => {
    // Victory Condition here
    if (G.deck.length <= 0) {
      console.log("Ending game since we are out of cards!");
      return getWinner(G);
    }
    const numResourcesLeft = Object.values(G.tokens).filter((res) => {
      return res.length > 0;
    }).length;
    console.log(numResourcesLeft, " resources left");
    if (numResourcesLeft <= NUM_RESOURCES_END) {
      console.log(
        "Ending game since we have reached the minimum number of trading token stacks!"
      );
      return getWinner(G);
    }
  },
};
