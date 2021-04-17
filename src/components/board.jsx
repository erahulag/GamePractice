import React, { Component } from "react";
import PlayerMoves from "./playerMoves";
import Popup from "react-popup";
import TokenStack from "./tokenStack";
import { RESOURCES, RARE_RESOURCES } from "../constants";
import "./styles/cards.scss";
import "./styles/boardLayout.css";
import BoardCards from "./boardCards";
import PlayerCards from "./playerCards";
import { MoveValidate } from "../game/moveValidation";
import SpecialTokens from "./specialTokens";
import ResultPage from "./resultPage";
import Sidebar from "./sidebar";
import ScoreBoard from "./scoreBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

class UdaipurBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSelected: [],
      handSelected: [],
    };
  }

  /**
   *  Methods to handle UI events and buttons such as:
   *    - Handling card click on Hand
   *    - Handling card click on the Board
   */

  alertError(error) {
    Popup.alert(error);
  }
  clearSelection = () => {
    this.setState({ boardSelected: [], handSelected: [] });
  };
  handleHandSelect = (cardID) => {
    let handSelected = this.state.handSelected.slice();
    const p = this.props.ctx.currentPlayer;
    let playerCards = this.props.G.players[p].cards.map((c) => c.id);
    handSelected = handSelected.filter((id) => playerCards.includes(id));
    if (!handSelected.includes(cardID)) {
      handSelected.push(cardID);
    } else {
      handSelected = handSelected.filter((x) => x !== cardID);
    }
    this.setState({ handSelected });
  };
  handleBoardSelect = (cardID) => {
    let boardSelected = new Set(this.state.boardSelected);
    const card = this.props.G.board.find((c) => c.id === cardID);
    const camels = new Set(
      this.props.G.board
        .filter((c) => c.type === RESOURCES.camel)
        .map((c) => c.id)
    );
    if (!boardSelected.has(cardID)) {
      if (card.type === RESOURCES.camel) {
        if (boardSelected.size === 0)
          camels.forEach((c) => boardSelected.add(c));
      } else {
        if (![...boardSelected].find((sc) => camels.has(sc))) {
          boardSelected.add(cardID);
        }
      }
    } else {
      if (card.type === RESOURCES.camel) {
        boardSelected.clear();
      } else {
        boardSelected.delete(cardID);
      }
    }
    this.setState({ boardSelected: [...boardSelected] });
  };

  /**
   *  Methods to handle various player actions
   *    - Do necessary checks on client end (TODO)
   *    - Notify user if action is invalid (WIP)
   *    - Dispatch move to server
   *    - Update UI wherever required
   */
  handleTrade = () => {
    console.log("Handling trade!");
    console.log(this.state.handSelected);
    const { G, ctx } = this.props;
    const validate = MoveValidate.trade(G, ctx, this.state.handSelected);
    let tradeToken = -1;
    if (validate.valid) {
      if (this.state.handSelected.length === 3) {
        tradeToken = 3;
      } else if (this.state.handSelected.length === 4) {
        tradeToken = 4;
      } else if (this.state.handSelected.length >= 5) {
        tradeToken = 5;
      }
      this.props.moves.trade(this.state.handSelected);
      this.setState({ tradeToken: tradeToken });
    } else {
      return this.alertError(validate.message);
    }
    this.clearSelection();
  };
  handleTakeOne = (cardid) => {
    const { G, ctx } = this.props;
    const boardSelection = new Set(this.state.boardSelected);
    if (cardid || cardid === 0) boardSelection.add(cardid);
    const cardToTake = [...boardSelection][0];
    const validate = MoveValidate.takeOne(G, ctx, cardToTake);

    // Some validation before performing the move
    if (boardSelection.size !== 1) {
      this.clearSelection();
      return this.alertError(
        "Please select only 1 card to take from the Board!"
      );
    } else if (!validate.valid) {
      this.clearSelection();
      return this.alertError(validate.message);
    } else {
      this.props.moves.takeOne(cardToTake);
      this.clearSelection();
    }
  };

  handleTakeCamels = () => {
    const board = this.props.G.board;
    const numCamelsOnBoard = board.filter(
      (card) => card.type === RESOURCES.camel
    ).length;
    if (numCamelsOnBoard <= 0) {
      this.clearSelection();
      return this.alertError(
        "Not enough camels on the board to perform that move!"
      );
    }
    this.props.moves.takeCamels();
    this.clearSelection();
  };
  handleTakeMany = () => {
    console.log("Handling take many!");
    const { G, ctx } = this.props;
    const validate = MoveValidate.takeMany(
      G,
      ctx,
      this.state.boardSelected,
      this.state.handSelected
    );
    if (validate.valid) {
      this.props.moves.takeMany(
        this.state.boardSelected,
        this.state.handSelected
      );
    } else {
      return this.alertError(validate.message);
    }
    this.clearSelection();
  };

  getActiveButtons = () => {
    const G = this.props.G;
    const p = this.props.ctx.currentPlayer;
    const iAmActive = this.props.ctx.currentPlayer === this.props.playerID;
    let active = {
      takeCamels: true,
      takeOne: true,
      takeMany: true,
      trade: true,
    };
    // If this player isn't the active player, then deactivate all the buttons
    if (!iAmActive) {
      let active = {
        takeCamels: false,
        takeOne: false,
        takeMany: false,
        trade: false,
      };
      return active;
    }
    // Check if camels can be taken from the board
    const numCamels = G.board.filter((card) => card.type === RESOURCES.camel)
      .length;
    if (numCamels === 0) {
      active.takeCamels = false;
    }

    // Check if one resource card can be taken from the board without replacement
    const numBoardResources = G.board.filter(
      (card) => card.type !== RESOURCES.camel
    ).length;
    if (numBoardResources === 0) {
      active.takeOne = false;
    }
    const numPlayerResources = G.players[p].cards.filter(
      (card) => card.type !== RESOURCES.camel
    ).length;
    if (numPlayerResources >= 7) {
      active.takeOne = false;
    }

    // Check if many resource cards can be taken from the board with replacement
    if (numBoardResources === 0) {
      active.takeMany = false;
    }
    if (G.players[p].cards.length === 0) {
      active.takeMany = false;
    }

    // Check if player has anything to trade
    if (numPlayerResources === 0) {
      active.trade = false; // No resources available to trade
    }

    // If player has ONLY rare resources, check if he has enough of any given kind
    const playerResources = G.players[p].cards.filter(
      (card) => card.type !== RESOURCES.camel
    );
    const numCommonResources = playerResources.filter(
      (card) => !RARE_RESOURCES.includes(card.type)
    ).length;
    if (numCommonResources === 0) {
      console.log("Only rare resources in the hand");
      let RR_DICT = {};
      playerResources.forEach((card) => {
        if (card.type in RR_DICT) {
          RR_DICT[card.type] += 1;
        } else {
          RR_DICT[card.type] = 1;
        }
      });
      let flag = false;
      for (let [, count] of Object.entries(RR_DICT)) {
        if (count >= 2) {
          flag = true;
          break;
        }
      }
      active.trade = flag;
    }
    return active;
  };
  getOtherPlayer = (p) => {
    if (p === 0 || p === "0") {
      return 1;
    } else {
      return 0;
    }
  };
  render() {
    const playerID = this.props.playerID;
    const opponentID = this.getOtherPlayer(playerID);
    const currentPlayer = this.props.ctx.currentPlayer;
    const gameOver = this.props.ctx.gameover;
    if (gameOver) {
      return <ResultPage playerID={playerID} gameOver={gameOver}></ResultPage>;
    }
    const boardCards = this.props.G.board;
    if (
      !this.props.G.players[playerID] ||
      !this.props.G.players[playerID].cards
    ) {
      return <ResultPage />;
    }
    const myCards = this.props.G.players[playerID].cards;
    const opponentCards = this.props.G.players[opponentID].cards;
    const deckLength = this.props.G.deckSize;
    const resourceTokens = this.props.G.tokens;
    const iAmActive = currentPlayer === playerID;
    const tradeTokens = this.props.G.players[playerID].trade_tokens;
    const t3 = this.props.G.players[playerID].T3;
    const t4 = this.props.G.players[playerID].T4;
    const t5 = this.props.G.players[playerID].T5;
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="container full_height">
          <div className="vsplit left bank">
            {/* Common Resources tokens */}
            {Object.keys(resourceTokens)
              .filter((key) => !RARE_RESOURCES.includes(key))
              .map((key) => (
                <TokenStack
                  id={key}
                  key={key}
                  resource={key}
                  coinValues={resourceTokens[key]}
                ></TokenStack>
              ))}
            {/* Special tokens (3T, 4T, 5T and largest-herd) */}
            <SpecialTokens tradeToken={this.state.tradeToken} />

            {/* Rare Resources tokens */}
            {Object.keys(resourceTokens)
              .filter((key) => RARE_RESOURCES.includes(key))
              .map((key) => (
                <TokenStack
                  id={key}
                  key={key}
                  resource={key}
                  coinValues={resourceTokens[key]}
                ></TokenStack>
              ))}
          </div>
          <div className="vsplit right playground">
            <div className="opponent-cards">
              <PlayerCards
                cards={opponentCards}
                selected={[]}
                faceUp={false}
                opponent={true}
                onClick={null}
                disabled={true}
              />
            </div>
            <BoardCards
              faceUp={true}
              deckLength={deckLength}
              onClick={this.handleBoardSelect}
              cards={boardCards}
              disabled={!iAmActive}
              selected={iAmActive ? this.state.boardSelected : []}
            />
            <PlayerMoves
              active={this.getActiveButtons()}
              onTrade={this.handleTrade}
              onTakeOne={this.handleTakeOne}
              onTakeMany={this.handleTakeMany}
              onTakeCamels={this.handleTakeCamels}
              clearHandler={this.clearSelection}
              currentPlayer={currentPlayer}
              playerID={playerID}
              cards={myCards}
              selected={iAmActive ? this.state.handSelected : []}
            />

            <PlayerCards
              cards={myCards}
              selected={iAmActive ? this.state.handSelected : []}
              faceUp={true}
              onTakeOne={this.handleTakeOne}
              onClick={this.handleHandSelect}
              opponent={false}
              disabled={!iAmActive}
            />
            <ScoreBoard T3={t3} T4={t4} T5={t5} tradeTokens={tradeTokens} />
          </div>
          <Sidebar chat={this.props.G.chat} me={playerID}></Sidebar>
        </div>
      </DndProvider>
    );
  }
}

export default UdaipurBoard;
