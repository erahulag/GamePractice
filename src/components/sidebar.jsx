import React, { Component } from "react";
import "./styles/sidebar.css";
class Sidebar extends Component {
  state = {
    open: false,
  };
  toggleState = () => {
    const open = this.state.open;
    this.setState({ open: !open });
  };
  render() {
    const sidebarContent = (
      <>
        <div className="chatbox">
          <div className="chat-item not-me">
            Hi there! Welcome to Udaipur! You will find a log of all player
            moves below...
          </div>
          {this.props.chat.map((chatItem, idx) => {
            const isMe = String(chatItem.player) === String(this.props.me);
            return (
              <div
                key={`chat-item-${idx}`}
                className={`chat-item ${isMe ? "me" : "not-me"}`}
              >
                {chatItem.action}
              </div>
            );
          })}
        </div>
      </>
    );
    return (
      <div className={"sidebar " + (this.state.open ? "open" : "closed")}>
        <div className={"sidebar-tab"} onClick={this.toggleState}>
          <div className="icon-container">
            <h3>History</h3>
          </div>
        </div>
        <div className="sidebar-content">
          {this.state.open ? sidebarContent : null}
        </div>
      </div>
    );
  }
}

export default Sidebar;
