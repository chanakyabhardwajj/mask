var Mask = React.createClass({

    isCharEditable: function(char) {
        return /[a-zA-Z0-9]/g.test(char);
    },

    getDefaultProps: function() {
        return {
            pattern : "",
            label : "Enter a value"
        };
    },

    getInitialState: function() {
        return {
            maskData : [] 
        };
    },

    componentDidMount: function() {
        var data = this.prepareMaskData();
        this.setState({
            maskData : data
        });

        this.getDOMNode().removeEventListener('keydown', this.handleKeyDown);
        this.getDOMNode().addEventListener('keydown', this.handleKeyDown);
    },

    componentWillUnmount: function() {
        this.getDOMNode().removeEventListener('keydown', this.handleKeyDown);
    },

    //Will be called only once, at the beginning.
    prepareMaskData : function() {
        self = this;
        return this.props.pattern.split("").map(function(patternChar, i) {
            return {
                defaultValue : patternChar,
                displayValue : null,
                isEditable : self.isCharEditable(patternChar),
                isFilled : false,
                isBlinking : i===0
            };
        });
    },

    handleKeyDown : function(e) {
        console.log("mask key down");

        if(this.props.inFocus) {
            if(e.metaKey) {
                //skip
                return;
            }
            if (e.keyCode === 9 || e.keyCode === 13) { //Tab || Enter
                //e.data = "next";
            }
            else if (e.keyCode === 8) { //BackSpace
                e.preventDefault();
                e.stopPropagation();

                var char = this.state.maskData.filter(function(charData, index) {
                    return charData.isEditable && charData.isFilled;
                }).pop();

                if(char !== undefined) {
                    var i = this.state.maskData.indexOf(char);
                    var newData = this.state.maskData.slice();
                    newData[i].displayValue = null;
                    newData[i].isFilled = false;

                    var blinkingChar = newData.filter(function(charData, index) {
                        return charData.isBlinking;
                    })[0];

                    var k = newData.indexOf(blinkingChar);
                    if(k!==i) {
                        newData[i].isBlinking = true;
                        newData[k].isBlinking = false;
                    }

                    this.setState({
                        maskData : newData
                    })
                }

            } else {
                if(e.keyCode>=48 && e.keyCode<=57 || e.keyCode>=96 && e.keyCode<=105) { //only numbers
                    e.stopPropagation();
                    var char = this.state.maskData.filter(function(charData, index) {
                        return charData.isEditable && !charData.isFilled;
                    })[0];

                    if(char !== undefined) {
                        var i = this.state.maskData.indexOf(char);
                        var newData = this.state.maskData.slice();
                        newData[i].displayValue = String.fromCharCode(e.keyCode);
                        newData[i].isFilled = true;

                        var nextChar = newData.filter(function(charData, index) {
                            return charData.isEditable && !charData.isFilled;
                        })[0];

                        if(nextChar) {
                            var k = newData.indexOf(nextChar);
                            newData[i].isBlinking = false;
                            newData[k].isBlinking = true;
                        }

                        this.setState({
                            maskData : newData
                        })
                    }
                }             
            }
        }
    },

    render: function() {
        var self = this;

        var maskChars = this.state.maskData.map(function(charData, index) {
            var cx = React.addons.classSet;
            var classes = cx({
                'MaskChar': true,
                'blink': charData.isBlinking,
                'editable': charData.isEditable,
                'uneditable': !charData.isEditable,
                'filled': charData.isFilled,
                'empty': !charData.isFilled
            });

            return <span className = {classes} key={index}>{charData.displayValue || charData.defaultValue}</span>;
        });

        var cx = React.addons.classSet;
        var classes = cx({
            'Mask' : true,
            'focussed': this.props.inFocus
        });

        return ( 
            <div className = {classes} onKeyDown = {this.handleKeyDown} onClick={this.props.onClick}>
                <span className="MaskLabel">{this.props.label}</span>
                <span className="MaskBody">{maskChars}</span>
            </div>
        ) 
    }
});

var App = React.createClass({
    getDefaultProps: function() {
        return {
            data : []
        };
    },

    getInitialState: function() {
        return {
            focusIndex : 0 
        };
    },

    appendFakeInput : function(index) {
        var inputElem = document.getElementById('fakeInput');
        inputElem.parentNode.removeChild(inputElem);
        this.getDOMNode().children[index].appendChild(inputElem);
        inputElem.focus();
    },

    handleClick : function(index) {
        this.setState({
            focusIndex : index
        });

        this.appendFakeInput(index);
    },

    render: function() {
        var self = this;

        return (
            <div className="appContainer">{
                this.props.data.map(function(maskData, index) {
                    return <Mask 
                            pattern={maskData.pattern} 
                            label={maskData.label} 
                            inFocus={index===self.state.focusIndex} 
                            onClick={self.handleClick.bind(self,index)} 
                            key={index} 
                            ref={index}/>;

                }, this)}</div>
        );
    }
});

var masks = [
    {
        pattern : "CCCC CCCC CCCC CCCC",
        label : "Credit Card Number"
    },
    {
        pattern : "MM/DD/YYYY",
        label : "Expiry Date"
    },
    {
        pattern : "CVC",
        label : "CVC Number"
    }
];

React.render( <App data={masks}/>, document.getElementById('appBox') );
