"use strict";

export default React.createClass({
    render() {
        return (
            <div className="cell">
                <div className={"coin " + (this.props.cell || "")}></div>
            </div>
        );
    }
});