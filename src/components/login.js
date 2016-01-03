"use strict";

const NAME_LENGTH = 12;

export default React.createClass({
    getInitialState() {
        return {
            playerName: null,
            hasErrors: false
        };
    },

    inputName(event) {
        this.setState({
            playerName: event.target.value.substr(0, NAME_LENGTH)
        });
    },

    startGame() {
        if (this.state.playerName) {
            this.props.onStartGame(this.state.playerName);
        } else {
            this.setState({
                hasErrors: true
            });
        }
    },

    render() {
        return (
            <div className="login">
                <h2>Welcome</h2>
                <input
                    type="text"
                    maxLength={NAME_LENGTH}
                    onChange={this.inputName}
                    placeholder="Your Name"
                    value={this.state.playerName}
                />
                <button onClick={this.startGame}>Start</button>
                { this.state.hasErrors ?
                    <span className="error">
                        You need to enter a name
                    </span> : null
                }
            </div>
        );
    }
});