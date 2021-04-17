// src/App.js
import React from "react";
import { Switch, Route, useHistory } from "react-router";
import Lobby from "./components/lobby.jsx";
import { Client } from "boardgame.io/react";
import { APP_PRODUCTION, gameServer } from "./config.js";
import { UdaipurGame } from "./game/game.js";
import UdaipurBoard from "./components/board.jsx";
import { SocketIO } from "boardgame.io/multiplayer";
import HomePage from "./components/homePage.jsx";
import HelpPage from "./components/helpPage.jsx";
import JoinPage from "./components/joinPage.jsx";
import { isMobile } from "react-device-detect";
import MobileCover from "./components/mobileCover.jsx";

function App() {
  const history = useHistory();
  const server = gameServer();
  const UdaipurClient = Client({
    game: UdaipurGame,
    board: UdaipurBoard,
    debug: false,
    multiplayer: SocketIO({ server: server }),
  });
  const renderUdaipurClient = () => {
    return <UdaipurClient playerID="0" />;
  };
  if (isMobile && APP_PRODUCTION && false) {
    return <MobileCover />;
  }
  return (
    <>
      <div>
        <div id={"moveIFrameDev"} /> <div id={"theIFrameDev"} />
      </div>
      <Switch>
        <Route
          path="/home"
          exact
          render={(props) => <HomePage {...props} history={history} />}
        />
        <Route
          path="/help"
          exact
          render={(props) => <HelpPage {...props} history={history} />}
        />
        <Route
          path="/join"
          exact
          render={(props) => <JoinPage {...props} history={history} />}
        />
        <Route path="/play" exact render={(props) => renderUdaipurClient()} />
        <Route path="/lobby/:id" component={Lobby} />
        <Route
          path="*"
          render={(props) => <HomePage {...props} history={history} />}
        />
      </Switch>
    </>
  );
}

export default App;
