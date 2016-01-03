"use strict";

export default React.createClass({
    getInitialState() {
        return {
            socket: null
        }
    },

    componentDidMount() {
        var socket = new WebSocket(`ws://${this.props.url}:${this.props.port}`);
        socket.onclose = this.props.onClose;
        socket.onerror = this.props.onError;
        socket.onopen = this.props.onOpen;

        socket.onmessage = (msg) => {
            if (this.props.onMessage && typeof this.props.onMessage === 'function') {
                this.props.onMessage(JSON.parse(msg.data));
            }
        };

        this.setState({
            socket: socket
        });
    },

    componentWillUnmount() {
        this.state.socket.close();
        this.state.socket = null;
    },

    send(msg, cb) {
        var error = null;
        try {
            this.state.socket.send(JSON.stringify(msg));
        } catch (ex) {
            error = ex;
        } finally {
            cb(error);
        }
    },

    render() {
        return null;
    }
});