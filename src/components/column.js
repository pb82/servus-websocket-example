"use strict";

import Cell from "./cell";

export default React.createClass({
    getInitialState() {
        return {
        }
    },

    render() {
        return (
            <div className="column" onClick={() => {
                this.props.onColumnClick(this.props.index)
            }}>
                {
                    this.props.column.map((cell, index) => {
                        return <Cell key={index} cell={cell} />
                    })
                }
            </div>
        );
    }
});