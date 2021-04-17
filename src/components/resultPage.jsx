import React, { Component } from "react";
import TemplatePage from "./templatePage";
import TokenStack from "./tokenStack";
import BoardCards from "./boardCards";
import { Link } from "react-router-dom";
import "./styles/resultPage.css";
class ResultPage extends Component {
  renderCollectedCoin(player) {
    const tradedCoins = player.trades.reduce((acc, { resource, value }) => {
      acc[resource] = [...(acc[resource] || []), value];
      return acc;
    }, {});
    return Object.keys(tradedCoins).map((resource) => (
      <TokenStack
        key={resource}
        resource={resource}
        coinValues={tradedCoins[resource]}
      />
    ));
  }
  renderCollectedBonus(player) {
    return Object.keys(player.bonus)
      .filter((r) => player.bonus[r] && player.bonus[r].length)
      .map((resource) => (
        <TokenStack
          key={resource}
          resource={resource}
          coinValues={player.bonus[resource]}
        />
      ));
  }
  renderCardsInHand(player) {
    return (
      <BoardCards
        faceUp={true}
        deckLength={0}
        cards={player.cards || []}
        selected={[]}
      />
    );
  }
  render() {
    const { playerID, gameOver } = this.props;
    if (!playerID || !gameOver) {
      return (
        <div className="new-game">
          <Link to="/">Start a new one</Link>
        </div>
      );
    }
    const iWon = String(gameOver.winner) === String(playerID);
    const content = (
      <>
        <div className="winning-message">
          {iWon ? (
            <div className="won">Congratulations you have won!</div>
          ) : (
            <div className="lost"> I'm afraid you have lost</div>
          )}
        </div>
        {false ? JSON.stringify(gameOver) : null}
        <div className="new-game">
          <Link to="/">Start a new one</Link>
        </div>
        <div className="scoreboard">
          <div
            className={
              "score-item " +
              (String(gameOver.winner) === "0" ? "winner " : "loser ") +
              (playerID === "0" ? "me" : "")
            }
          >
            <span className="username">
              {playerID === "0" ? "You" : "Opponent"}
            </span>

            <span className="score">{gameOver.scores[0]}</span>
            <span className="show-if-won">({gameOver.board.reason})</span>
            <div className="collected-coins">
              {this.renderCollectedCoin(gameOver.board.p0)}
              {this.renderCollectedBonus(gameOver.board.p0)}
            </div>
            <div className="remaing-hand">
              {this.renderCardsInHand(gameOver.board.p0)}
            </div>
          </div>
          <div
            className={
              "score-item " +
              (String(gameOver.winner) === "1" ? "winner " : "loser ") +
              (playerID === "1" ? "me" : "")
            }
          >
            <span className="username">
              {playerID === "1" ? "You" : "Opponent"}
            </span>
            <span className="score"> {gameOver.scores[1]}</span>
            <span className="show-if-won">({gameOver.board.reason})</span>
            <div className="collected-coins">
              {this.renderCollectedCoin(gameOver.board.p1)}
              {this.renderCollectedBonus(gameOver.board.p1)}
            </div>
            <div className="remaing-hand">
              {this.renderCardsInHand(gameOver.board.p1)}
            </div>
          </div>
        </div>
        <div className="new-game">
          <Link to="/">Start a new one</Link>
        </div>
      </>
    );
    return <TemplatePage content={content}></TemplatePage>;
  }
}

export default ResultPage;
