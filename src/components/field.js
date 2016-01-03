"use strict";

import Column from "./column";

function drop(column, coin) {
    for (let i= column.length-1; i >= 0; i--) {
        if(!column[i]) {
            column[i] = coin;
            return;
        }
    }
}

export default React.createClass({
    getCleanField() {
        return [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ];
    },

    getInitialState() {
        return {
            field: this.getCleanField()
        }
    },

    reset() {
        this.setState({
            field: this.getCleanField()
        })
    },

    canPut(col) {
        return this.state.field[col][0] === null;
    },

    put(col, type) {
        var field = this.state.field;
        drop(field[col], type);

        this.setState({
            field: field
        });
    },

    render() {
        return (
            <div className="field">
                {
                    this.state.field.map((column, index) => {
                        return <Column
                            onColumnClick={this.props.onColumnClick}
                            column={column}
                            index={index}
                            key={index}
                        />
                    })
                }
            </div>
        );
    }
});