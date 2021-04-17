import React, { Component } from "react";
import "./styles/tokenstack.scss";
class TokenStack extends Component {
  state = {};
  getCoins = (coinValues) =>
    coinValues.map((val, ind) => {
      return (
        <div
          id={ind}
          key={"cv" + ind}
          className={ind === 0 ? "coin first" : "coin"}
        >
          <div className="coin-value">
            <div className="cv-top">{val}</div>
            <div className="cv-bottom">{val}</div>
            <div className="cv-left">{val}</div>
            <div className="cv-right">{val}</div>
          </div>
        </div>
      );
    });

  getColourClass = () => {
    const resType = this.props.resource.toLowerCase();
    // Perform more complicated inference from resource type here if needed.
    // TODO: Check if camel here and do something accordingly
    return resType;
  };
  render() {
    return (
      <div className={"coin-container " + this.getColourClass()}>
        <div className="coin-name">
          <span>
            {this.props.resource.toLowerCase() === "diamond"
              ? "RUBY"
              : this.props.resource}
          </span>
        </div>
        {this.getCoins(this.props.coinValues)}
      </div>
    );
  }
}

export default TokenStack;
