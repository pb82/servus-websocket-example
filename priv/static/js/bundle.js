/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _login = __webpack_require__(1);

	var _login2 = _interopRequireDefault(_login);

	var _game = __webpack_require__(2);

	var _game2 = _interopRequireDefault(_game);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MODE_LOGIN = Symbol("login");
	var MODE_GAME = Symbol("game");

	var App = React.createClass({
	    displayName: "App",
	    getInitialState: function getInitialState() {
	        return {
	            mode: MODE_LOGIN
	        };
	    },
	    render: function render() {
	        var _this = this;

	        return React.createElement(
	            "div",
	            null,
	            (function () {
	                switch (_this.state.mode) {
	                    case MODE_LOGIN:
	                        return React.createElement(_login2.default, { onStartGame: _this.onStartGame });
	                    case MODE_GAME:
	                        return React.createElement(_game2.default, {
	                            onAbort: _this.onAbortGame,
	                            player: _this.state.playerName
	                        });
	                }
	            })()
	        );
	    },
	    onAbortGame: function onAbortGame() {
	        this.setState({
	            mode: MODE_LOGIN,
	            playerName: null
	        });
	    },
	    onStartGame: function onStartGame(name) {
	        this.setState({
	            mode: MODE_GAME,
	            playerName: name
	        });
	    }
	});

	ReactDOM.render(React.createElement(App, null), document.getElementById("app"));

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var NAME_LENGTH = 12;

	exports.default = React.createClass({
	    displayName: "login",
	    getInitialState: function getInitialState() {
	        return {
	            playerName: null,
	            hasErrors: false
	        };
	    },
	    inputName: function inputName(event) {
	        this.setState({
	            playerName: event.target.value.substr(0, NAME_LENGTH)
	        });
	    },
	    startGame: function startGame() {
	        if (this.state.playerName) {
	            this.props.onStartGame(this.state.playerName);
	        } else {
	            this.setState({
	                hasErrors: true
	            });
	        }
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "login" },
	            React.createElement(
	                "h2",
	                null,
	                "Welcome"
	            ),
	            React.createElement("input", {
	                type: "text",
	                maxLength: NAME_LENGTH,
	                onChange: this.inputName,
	                placeholder: "Your Name",
	                value: this.state.playerName
	            }),
	            React.createElement(
	                "button",
	                { onClick: this.startGame },
	                "Start"
	            ),
	            this.state.hasErrors ? React.createElement(
	                "span",
	                { className: "error" },
	                "You need to enter a name"
	            ) : null
	        );
	    }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	"use struct";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _socket = __webpack_require__(3);

	var _socket2 = _interopRequireDefault(_socket);

	var _field = __webpack_require__(4);

	var _field2 = _interopRequireDefault(_field);

	var _commons = __webpack_require__(7);

	var _commons2 = _interopRequireDefault(_commons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = React.createClass({
	    displayName: "game",
	    getInitialState: function getInitialState() {
	        return {
	            message: null,
	            mode: _commons2.default.MODE_WAITING
	        };
	    },

	    /**
	     * Main dispatch function. This function received the messages from
	     * the socket (server) and handles them.
	     *
	     * @param msg Javascript object in the form {type: @string, value: @any}
	     * @returns undefined
	     */
	    onSocketMessage: function onSocketMessage(msg) {
	        var _this = this;

	        switch (msg.type) {
	            case "start":
	                // Game has started (number of players (2) reached)
	                return this.startGame(msg.value);
	            case "abort":
	                // Opponent aborted the connection
	                return this.props.onAbort();
	            case "turn":
	                // It's your turn now
	                return this.setState({ mode: _commons2.default.MODE_TURN, message: _commons2.default.YOUR_TURN });
	            case "set":
	                // The opponent put a coin, display it on your own field
	                return this.field.put(msg.value, _commons2.default.COIN_OPP);
	            case "win":
	                // You won
	                return this.setState({ message: _commons2.default.WIN, mode: _commons2.default.MODE_FINISED });
	            case "loose":
	                // You lost
	                return this.setState({ message: _commons2.default.LOOSE, mode: _commons2.default.MODE_FINISED });
	            case "reset":
	                /**
	                 * Reset message received: one of the players wants to play
	                 * again, so reset the game field and wait for further
	                 * messages.
	                 */
	                return (function () {
	                    _this.field.reset();
	                    _this.setState({
	                        mode: _commons2.default.MODE_OPPTURN,
	                        message: _commons2.default.OPP_TURN
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
	    onSocketOpen: function onSocketOpen() {
	        var _this2 = this;

	        this.socket.send({
	            type: "join",
	            value: this.props.player
	        }, function (err) {
	            _this2.setState({
	                mode: err ? _commons2.default.MODE_ERROR : _commons2.default.MODE_WAITING
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
	    startGame: function startGame(opponent) {
	        this.setState({
	            mode: _commons2.default.MODE_OPPTURN,
	            message: _commons2.default.OPP_TURN,
	            opponent: opponent
	        });
	    },

	    /**
	     * After a game is won or lost the player gets the option to
	     * play again with the same opponent. We tell the server to
	     * reset it's state and wait for the `reset` message.
	     */
	    restartGame: function restartGame() {
	        this.socket.send({
	            type: "restart",
	            value: null
	        }, function (err) {});
	    },

	    /**
	     * This function is called when a player clicks on a column. We
	     * have to validate if the player is in a position to make a turn.
	     * If yes, send a `put` message to the server. Otherwise just
	     * ignore it.
	     *
	     * @param col The column index
	     */
	    put: function put(col) {
	        var _this3 = this;

	        if (this.state.mode === _commons2.default.MODE_TURN && this.field.canPut(col)) {
	            /**
	             * Immediately set the mode to 'Opponent turn' in order to
	             * prevent double put. Since client and server have their
	             * own state, we have to validate turns on both sides.
	             */
	            this.setState({
	                mode: _commons2.default.MODE_OPPTURN,
	                message: _commons2.default.OPP_TURN
	            });

	            /**
	             * Then send a `put` message to the server to inform him
	             * into which column the player put a coin.
	             */
	            this.socket.send({
	                type: "put",
	                value: col
	            }, function (err) {
	                // TODO: handle the error in some way
	                if (!err) {
	                    _this3.field.put(col, _commons2.default.COIN_YOU);
	                }
	            });
	        }
	    },

	    /**
	     * If any kind of socket error occurs we set the  mode to
	     * 'Error' which will display a message. This will also
	     * effectively halt the game.
	     */
	    onSocketError: function onSocketError() {
	        if (this.isMounted()) {
	            this.setState({
	                mode: _commons2.default.MODE_ERROR
	            });
	        }
	    },
	    render: function render() {
	        var _this4 = this;

	        return React.createElement(
	            "div",
	            { className: "game" },
	            React.createElement(_socket2.default, {
	                url: "localhost",
	                port: 3335,
	                onOpen: this.onSocketOpen,
	                onError: this.onSocketError,
	                onMessage: this.onSocketMessage,
	                ref: function ref(socket) {
	                    _this4.socket = socket;
	                }
	            }),

	            // Message
	            (function () {
	                switch (_this4.state.mode) {
	                    case _commons2.default.MODE_WAITING:
	                        return React.createElement(
	                            "span",
	                            { className: "info" },
	                            "Waiting for opponent"
	                        );
	                    case _commons2.default.MODE_ERROR:
	                        return React.createElement(
	                            "span",
	                            { className: "error" },
	                            "Socket error, pleas try again"
	                        );
	                    default:
	                        return null;
	                }
	            })(),

	            // X vs Y message
	            this.state.opponent ? React.createElement(
	                "h3",
	                { className: "vs" },
	                React.createElement(
	                    "span",
	                    { className: "youS" },
	                    this.props.player
	                ),
	                " vs ",
	                React.createElement(
	                    "span",
	                    { className: "oppS" },
	                    this.state.opponent
	                )
	            ) : null,

	            // Game message
	            this.state.message ? React.createElement(
	                "h3",
	                null,
	                this.state.message,
	                this.state.mode === _commons2.default.MODE_FINISED ? React.createElement(
	                    "a",
	                    { href: "#",
	                        onClick: this.restartGame,
	                        className: "linkBtn", href: "#" },
	                    "Click here to play again!"
	                ) : null
	            ) : null,

	            // Only render the game field when the `opponent` field
	            // is set.
	            this.state.opponent ? React.createElement(_field2.default, {
	                onColumnClick: this.put,
	                ref: function ref(field) {
	                    _this4.field = field;
	                }
	            }) : null
	        );
	    }
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = React.createClass({
	    displayName: "socket",
	    getInitialState: function getInitialState() {
	        return {
	            socket: null
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        var _this = this;

	        var socket = new WebSocket("ws://" + this.props.url + ":" + this.props.port);
	        socket.onclose = this.props.onClose;
	        socket.onerror = this.props.onError;
	        socket.onopen = this.props.onOpen;

	        socket.onmessage = function (msg) {
	            if (_this.props.onMessage && typeof _this.props.onMessage === 'function') {
	                _this.props.onMessage(JSON.parse(msg.data));
	            }
	        };

	        this.setState({
	            socket: socket
	        });
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        this.state.socket.close();
	        this.state.socket = null;
	    },
	    send: function send(msg, cb) {
	        var error = null;
	        try {
	            this.state.socket.send(JSON.stringify(msg));
	        } catch (ex) {
	            error = ex;
	        } finally {
	            cb(error);
	        }
	    },
	    render: function render() {
	        return null;
	    }
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _column = __webpack_require__(5);

	var _column2 = _interopRequireDefault(_column);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function drop(column, coin) {
	    for (var i = column.length - 1; i >= 0; i--) {
	        if (!column[i]) {
	            column[i] = coin;
	            return;
	        }
	    }
	}

	exports.default = React.createClass({
	    displayName: "field",
	    getCleanField: function getCleanField() {
	        return [[null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null]];
	    },
	    getInitialState: function getInitialState() {
	        return {
	            field: this.getCleanField()
	        };
	    },
	    reset: function reset() {
	        this.setState({
	            field: this.getCleanField()
	        });
	    },
	    canPut: function canPut(col) {
	        return this.state.field[col][0] === null;
	    },
	    put: function put(col, type) {
	        var field = this.state.field;
	        drop(field[col], type);

	        this.setState({
	            field: field
	        });
	    },
	    render: function render() {
	        var _this = this;

	        return React.createElement(
	            "div",
	            { className: "field" },
	            this.state.field.map(function (column, index) {
	                return React.createElement(_column2.default, {
	                    onColumnClick: _this.props.onColumnClick,
	                    column: column,
	                    index: index,
	                    key: index
	                });
	            })
	        );
	    }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _cell = __webpack_require__(6);

	var _cell2 = _interopRequireDefault(_cell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = React.createClass({
	    displayName: "column",
	    getInitialState: function getInitialState() {
	        return {};
	    },
	    render: function render() {
	        var _this = this;

	        return React.createElement(
	            "div",
	            { className: "column", onClick: function onClick() {
	                    _this.props.onColumnClick(_this.props.index);
	                } },
	            this.props.column.map(function (cell, index) {
	                return React.createElement(_cell2.default, { key: index, cell: cell });
	            })
	        );
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = React.createClass({
	    displayName: "cell",
	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "cell" },
	            React.createElement("div", { className: "coin " + (this.props.cell || "") })
	        );
	    }
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    YOUR_TURN: "Your turn",
	    OPP_TURN: "Opponent turn",
	    WIN: "You win!",
	    LOOSE: "You loose",
	    MODE_WAITING: Symbol(),
	    MODE_ERROR: Symbol(),
	    MODE_OPPTURN: Symbol(),
	    MODE_TURN: Symbol(),
	    MODE_FINISED: Symbol(),
	    COIN_YOU: "you",
	    COIN_OPP: "opp"
	};

/***/ }
/******/ ]);