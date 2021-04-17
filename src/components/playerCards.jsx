import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { RESOURCES } from "../constants";
import Card from "./card";
import { Droppable } from "./droppable";

class PlayerCards extends Component {
  state = {};
  handleDropCards = (dropped_items) => {
    console.log(dropped_items);
    this.props.onTakeOne(dropped_items.meta_to_be_moved.cards[0]);
  };
  render() {
    return (
      <TransitionGroup className="card-container player">
        <Droppable
          disabled={this.props.disabled}
          handleMove={this.handleDropCards}
        >
          <div className="camels fan-container">
            {this.props.cards
              .filter((card) => card.type === RESOURCES.camel)
              .map((card) => (
                <CSSTransition
                  key={card.id}
                  timeout={500}
                  classNames={"card fan camel"}
                >
                  <Card
                    key={card.id}
                    card={card}
                    selected={this.props.selected.includes(card.id)}
                    faceUp={true}
                    enabled={!this.props.opponent}
                    type="HAND"
                    direction="horizontal"
                    onClick={this.props.onClick}
                  />
                </CSSTransition>
              ))}
          </div>
          <div className="item-cards fan-container">
            {this.props.cards
              .filter((card) => card.type !== RESOURCES.camel)
              .map((card) => (
                <CSSTransition key={card.id} timeout={500} classNames="card">
                  <Card
                    key={card.id}
                    card={card}
                    selected={this.props.selected.includes(card.id)}
                    faceUp={this.props.faceUp}
                    enabled={!this.props.opponent}
                    type="HAND"
                    onClick={this.props.onClick}
                  ></Card>
                </CSSTransition>
              ))}
          </div>
        </Droppable>
      </TransitionGroup>
    );
  }
}

export default PlayerCards;
