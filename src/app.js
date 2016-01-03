"use strict";

import Login from "./components/login";
import Game from "./components/game";

const MODE_LOGIN = Symbol("login");
const MODE_GAME = Symbol("game");

var App = React.createClass({
    getInitialState() {
        return {
            mode: MODE_LOGIN
        }
    },

    render() {
        return (
            <div>
                {
                    (() => {
                        switch (this.state.mode) {
                            case MODE_LOGIN:
                                return <Login onStartGame={this.onStartGame}/>
                            case MODE_GAME:
                                return <Game
                                    onAbort={this.onAbortGame}
                                    player={this.state.playerName}
                                />
                        }
                    })()
                }
            </div>
        );
    },

    onAbortGame() {
        this.setState({
            mode: MODE_LOGIN,
            playerName: null
        });
    },

    onStartGame(name) {
        this.setState({
            mode: MODE_GAME,
            playerName: name
        });
    }
});

ReactDOM.render(<App />, document.getElementById("app"));
