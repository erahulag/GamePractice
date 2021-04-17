import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Card from "./card";
import { Draggable } from "./draggable";
import { RESOURCES } from "../constants";

class BoardCards extends Component {
  state = {};
  render() {
    return (
      <TransitionGroup className="card-container board">
        <div className="board-cards">
          {this.props.cards.map((card) => (
            <CSSTransition key={card.id} timeout={500} classNames="card">
              <Draggable
                disabled={
                  this.props.disabled ||
                  this.props.selected.length > 1 ||
                  card.type === RESOURCES.camel
                }
                meta_to_be_moved={{
                  source: "BOARD",
                  cards: [card.id],
                }}
                type={`card`}
                previews={[card.type]}
              >
                <Card
                  key={card.id}
                  card={card}
                  type="BOARD"
                  enabled={true}
                  faceUp={this.props.faceUp}
                  selected={this.props.selected.includes(card.id)}
                  onClick={this.props.onClick}
                />
              </Draggable>
            </CSSTransition>
          ))}
        </div>
        {this.props.deckLength ? (
          <Card
            type="DECK"
            faceUp={false}
            length={this.props.deckLength}
            className="deck"
            direction="horizontal"
          />
        ) : null}
      </TransitionGroup>
    );
  }
}

export default BoardCards;
