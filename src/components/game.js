"use struct"

import Socket from "./socket";
import Field from "./field";
import C from "./commons";

export default React.createClass({
    getInitialState() {
        return {
            message: null,
            mode: C.MODE_WAITING
        }
    },

    /**
     * Main dispatch function. This function received the messages from
     * the socket (server) and handles them.
     *
     * @param msg Javascript object in the form {type: @string, value: @any}
     * @returns undefined
     */
    onSocketMessage(msg) {
        switch (msg.type) {
            case "start":
                // Game has started (number of players (2) reached)
                return this.startGame(msg.value);
            case "abort":
                // Opponent aborted the connection
                return this.props.onAbort();
            case "turn":
                // It's your turn now
                return this.setState({mode: C.MODE_TURN, message: C.YOUR_TURN});
            case "set":
                // The opponent put a coin, display it on your own field
                return this.field.put(msg.value, C.COIN_OPP);
            case "win":
                // You won
                return this.setState({message: C.WIN, mode: C.MODE_FINISED});
            case "loose":
                // You lost
                return this.setState({message: C.LOOSE, mode: C.MODE_FINISED});
            case "reset":
                /**
                 * Reset message received: one of the players wants to play
                 * again, so reset the game field and wait for further
                 * messages.
                 */
                return (() => {
                    this.field.reset();
                    this.setState({
                        mode: C.MODE_OPPTURN,
                        message: C.OPP_TURN
                    });
                })();
            default:
                // TODO: reasonable handling of improper messages
                return this.props.onAbort();
        }
    },

    /**
     * Directly after the connection is established we send a
     * `join` message to join the game queue. After that we wait
     * for another player to join.
     */
    onSocketOpen() {
        this.socket.send({
            type: "join",
            value: this.props.player
        }, (err) => {
            this.setState({
                mode: err ? C.MODE_ERROR : C.MODE_WAITING
            });
        });
    },

    /**
     * This function is called by the dispather as soon as a
     * `start` message is received. It sets the opponent which
     * will cause the gamefield to be rendered. Also to be sure,
     * we always go in to 'Opponent's turn' state and wait for
     * further messages from the server.
     *
     * @param opponent The opponent's name
     */
    startGame(opponent) {
        this.setState({
            mode: C.MODE_OPPTURN,
            message: C.OPP_TURN,
            opponent: opponent
        });
    },

    /**
     * After a game is won or lost the player gets the option to
     * play again with the same opponent. We tell the server to
     * reset it's state and wait for the `reset` message.
     */
    restartGame() {
        this.socket.send({
            type: "restart",
            value: null
        }, (err) => {});
    },

    /**
     * This function is called when a player clicks on a column. We
     * have to validate if the player is in a position to make a turn.
     * If yes, send a `put` message to the server. Otherwise just
     * ignore it.
     *
     * @param col The column index
     */
    put(col) {
        if (this.state.mode === C.MODE_TURN && this.field.canPut(col)) {
            /**
             * Immediately set the mode to 'Opponent turn' in order to
             * prevent double put. Since client and server have their
             * own state, we have to validate turns on both sides.
             */
            this.setState({
                mode: C.MODE_OPPTURN,
                message: C.OPP_TURN
            });

            /**
             * Then send a `put` message to the server to inform him
             * into which column the player put a coin.
             */
            this.socket.send({
                type: "put",
                value: col
            }, (err) => {
                // TODO: handle the error in some way
                if (!err) {
                    this.field.put(col, C.COIN_YOU);
                }
            });
        }
    },

    /**
     * If any kind of socket error occurs we set the  mode to
     * 'Error' which will display a message. This will also
     * effectively halt the game.
     */
    onSocketError() {
        if (this.isMounted()) {
            this.setState({
                mode: C.MODE_ERROR
            });
        }
    },

    render() {
        return (
            <div className="game">
                <Socket
                    url={"localhost"}
                    port={3335}
                    onOpen={this.onSocketOpen}
                    onError={this.onSocketError}
                    onMessage={this.onSocketMessage}
                    ref={(socket) => {this.socket = socket}}
                />
                {
                    // Message
                    (() => {
                        switch (this.state.mode) {
                            case C.MODE_WAITING:
                                return <span className="info">
                                 Waiting for opponent
                                </span>;
                            case C.MODE_ERROR:
                                return <span className="error">
                                Socket error, pleas try again
                                </span>;
                            default:
                                return null;
                        }
                    })()
                }
                {
                    // X vs Y message
                    this.state.opponent ? <h3 className="vs">
                        <span className="youS">{this.props.player}</span> vs&nbsp;
                        <span className="oppS">{this.state.opponent}</span>
                    </h3> : null
                }
                {
                    // Game message
                    this.state.message ? <h3>
                        {this.state.message}
                        {
                            this.state.mode === C.MODE_FINISED
                                ? <a href="#"
                                onClick={this.restartGame}
                                className="linkBtn" href="#">Click here to play again!
                            </a>
                                : null
                        }
                    </h3> : null
                }
                {
                    // Only render the game field when the `opponent` field
                    // is set.
                    this.state.opponent ? <Field
                        onColumnClick={this.put}
                        ref={(field) => {this.field = field}}
                    /> : null
                }
            </div>
        );
    }
});