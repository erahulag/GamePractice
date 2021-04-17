import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import "./styles/specialTokens.css";
class SpecialTokens extends Component {
  pulse() {
    return [3, 4, 5, 19].find((t) => t === this.props.tradeToken)
      ? "pulse"
      : "";
  }
  render() {
    return (
      <div className="sp-token-container">
        <div
          className={"token three " + this.pulse()}
          data-tip={"3 Card Bonus"}
        />
        <div
          className={"token four " + this.pulse()}
          data-tip={"4 Card Bonus"}
        />
        <div
          className={"token five " + this.pulse()}
          data-tip={"5 Card Bonus"}
        />
        <div className={"token herd " + this.pulse()} />
      </div>
    );
  }
}
export default SpecialTokens;
