import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import "./styles/scoreBoard.css";
class ScoreBoard extends Component {
  state = {};
  render() {
    const tradeTokens = this.props.tradeTokens;
    const score = tradeTokens.reduce(
      (result, token) => result + token.value,
      0
    );
    return (
      <>
        <div className="game-scoreboard">
          <div className="coin-value-total">{score}</div>
          {this.props.T3 ? (
            <>
              <div
                className={"t3-counter mini-token"}
                data-tip={"3 Card Bonus"}
              />
              <div className={"c3-counter"}> {this.props.T3}</div>
            </>
          ) : null}
          {this.props.T4 ? (
            <>
              <div
                className={"t4-counter mini-token"}
                data-tip={"4 Card Bonus"}
              />
              <div className={"c4-counter"}> {this.props.T4}</div>
            </>
          ) : null}
          {this.props.T5 ? (
            <>
              <div
                className={"t5-counter mini-token"}
                data-tip={"5 Card Bonus"}
              />
              <div className={"c5-counter"}> {this.props.T5}</div>
            </>
          ) : null}
          <ReactTooltip />
        </div>
      </>
    );
  }
}

export default ScoreBoard;
