import React, { Component } from "react";
import "./styles/button.css";
import TurnIndicator from "./turnIndicator";
class PlayerMoves extends Component {
  render2Words(word_str) {
    const [verb, action] = word_str.split(" ");
    return (
      <div className="verb-action">
        <div key="verb" className="verb">
          {verb}
        </div>

        <div key="action" className="action">
          {action}
        </div>
      </div>
    );
  }
  renderLetters(
    word_str,
    radius = "4vw",
    deg = 15,
    adjustment = 0,
    type = "2"
  ) {
    if (type === "2") {
      return this.render2Words(word_str);
    }
    const [up, down] = word_str.split(" ");

    let deg2 = -deg;
    const origin = (-deg * up.length) / 2 + adjustment;
    const origin2 = 160 + (deg * down.length) / 2;

    return [
      <div key="up" className="up-arc">
        {[...up].map((l, idx) => {
          return (
            <span
              key={"up-l" + idx}
              style={{ transform: `rotate(${origin + deg * idx}deg)` }}
              class={"up-letter"}
            >
              {l}
            </span>
          );
        })}
      </div>,
      <div key="down" className="down-arc">
        {[...down].map((l, idx) => {
          return (
            <span
              key={"down-l" + idx}
              style={{ transform: `rotate(${origin2 + deg2 * idx}deg)` }}
              class={"down-letter"}
            >
              <span>{l}</span>
            </span>
          );
        })}
      </div>,
    ];
  }
  render() {
    const {
      active,
      currentPlayer,
      playerID,
      onTakeCamels,
      onTakeOne,
      onTrade,
      onTakeMany,
    } = this.props;
    return (
      <div className="player-moves">
        <div>
          <TurnIndicator currentPlayer={currentPlayer} playerID={playerID} />
        </div>
        <button
          className="deep-button"
          disabled={!active.takeCamels}
          onClick={() => onTakeCamels()}
        >
          {this.renderLetters("Take Camels")}
        </button>
        <button
          className="deep-button"
          disabled={!active.takeOne}
          onClick={() => onTakeOne()}
        >
          {this.renderLetters("Take One")}
        </button>
        <button
          className="deep-button"
          disabled={!active.takeMany}
          onClick={() => onTakeMany()}
        >
          {this.renderLetters("Take Many")}
        </button>
        <button
          className="deep-button trade"
          disabled={!active.trade}
          onClick={() => onTrade()}
        >
          {this.renderLetters(`Sell items`)}
        </button>
      </div>
    );
  }
}
export default PlayerMoves;
