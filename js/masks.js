var datePattern = "MM/DD/YYYY";
var ccPattern = "CCCC CCCC CCCC CCCC";

var MaskChar = React.createClass({
    getInitialState: function() {
        return {
            value: null,
            isFilled: false,
            blinking : false
        };
    },

    typeValue: function(char) {
        if ((/[0-9A-Za-z]/).test(char)) {
            console.log("Char to be typed %s is valid", char);
            this.setState({
                value: char,
                isFilled: true
            });
            return true;

        } else {
            return false;
        }
    },

    deleteValue: function(char) {
        this.setState({
            value: null,
            isFilled: false
        });
    },

    setBlinking: function(bool) {
        this.setState({
            blinking : bool
        });
    },

    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'MaskChar': true,
            'blink': this.state.blinking,
            'editable': this.props.isEditable,
            'uneditable': !this.props.isEditable,
            'filled': this.state.isFilled,
            'empty': !this.state.isFilled
        });

        return <span className = {classes} > {this.state.value || this.props.sourceChar} < /span>; 
    }
});

var Mask = React.createClass({
    maskChars: [],

    blinkingCharIndex : [],

    isCharEditable: function(char) {
        return ["M", "D", "Y", "C"].indexOf(char) > -1;
    },

    getTypableCharacter: function() {
        var self = this;
        return this.maskChars.filter(function(maskChar, index) {
            var char = self.refs["maskChar" + index];
            return char.props.isEditable && !char.state.isFilled;
        })[0];
    },

    getDeletableCharacter: function() {
        var self = this;
        var filledValues = this.maskChars.filter(function(maskChar, index) {
            var char = self.refs["maskChar" + index];
            return char.props.isEditable && char.state.isFilled;
        });

        return filledValues.pop();
    },

    componentDidMount: function() {
        document.addEventListener('keydown', this.handleKeyDown);

        var firstTypableChar = this.getTypableCharacter();

        if (!!firstTypableChar) {
            this.refs[firstTypableChar.ref].setBlinking(true);
            this.blinkingCharIndex = this.maskChars.indexOf(firstTypableChar);
        } else {
            console.log("Nothing to blink!!")
        }
    },

    componentWillUnmount: function() {
        document.removeEventListener('keydown', this.handleKeyDown);
    },

    handleKeyDown: function(e) {
        if (e.keyCode === 8) { //BackSpace
            var deletableChar = this.getDeletableCharacter();

            if (!!deletableChar) {
                this.refs[deletableChar.ref].deleteValue();
                this.refs[this.maskChars[this.blinkingCharIndex].ref].setBlinking(false);
                this.refs[deletableChar.ref].setBlinking(true);
                this.blinkingCharIndex = this.maskChars.indexOf(deletableChar);
                
            } else {
                console.log("Nothing to delete.")
            }

            e.preventDefault();

        } else { //Everything else
            var typedChar = String.fromCharCode(e.which);
            var typableChar = this.getTypableCharacter();

            if (!!typableChar) {
                this.refs[typableChar.ref].typeValue(typedChar);

                var nextTypableChar = this.getTypableCharacter();

                if (!!nextTypableChar) {
                    this.refs[typableChar.ref].setBlinking(false);
                    this.refs[nextTypableChar.ref].setBlinking(true);
                    this.blinkingCharIndex =  this.maskChars.indexOf(nextTypableChar);
                }

            } else {
                console.log("Can't type anymore.")
            }
        }

    },

    render: function() {
        var self = this;

        self.maskChars = this.props.pattern.split("").map(function(patternChar, i) {
            return ( < MaskChar sourceChar = {patternChar} isEditable = {self.isCharEditable(patternChar)} ref = {"maskChar" + i} /> ) 
        });

        var maskStyle = {
            fontSize: "25px",
            lineHeight: "50px",
            margin: "auto",
            padding: "10px",
            display: "block" 
        }

        return ( 
            <div className = "Mask" style = {maskStyle} onClick = {this.handleKeyDown}><span className="MaskLabel">Enter a date : </span>{self.maskChars}</div>
        ) 
    }
});

React.render( <Mask pattern = {datePattern}/>, document.getElementById('dateContainer') );
React.render( <Mask pattern = {ccPattern}/>, document.getElementById('ccContainer') );
