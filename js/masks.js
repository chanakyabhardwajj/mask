var maskPattern = "MM/DD/YY";

var isCharEditable = function(char) {
    return char === "D" || char === "M" || char === "Y";
}

var MaskChar = React.createClass({
    getInitialState: function() {
        return {
            value : null,
            isFilled : false
      };
    },

    typeValue: function(char) {
        if( (/[0-9A-Za-z]/).test(char)) {
            console.log("Char to be typed %s is valid", char);
            this.setState({
                value : char,
                isFilled : true
            });
          return true;

        } else {
            return false;
        }
    },

    deleteValue: function(char) {
        this.setState({
            value : null,
            isFilled : false
      });
    },

    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'MaskChar' : true,
            'active' : this.props.isActive,
            'editable': this.props.isEditable,
            'uneditable': !this.props.isEditable,
            'filled': this.state.isFilled,
            'empty': !this.state.isFilled
        });

        return <span className={classes}>{this.state.value || this.props.sourceChar}</span>;
    }
});

var Mask = React.createClass({
    isCharEditable : function(char) {
        return char === "D" || char === "M" || char === "Y";
    },

    editableIndices : [],

    editIndex : 0,

    componentDidMount: function() {
        document.addEventListener('keypress', this.handleKeyDown);
    },

    componentWillUnmount: function() {
        document.removeEventListener('keypress', this.handleKeyDown);
    },

    handleKeyDown : function(e) {
        if(this.editIndex < this.editableIndices.length) {
            var typedChar = String.fromCharCode(e.which);
            var maskChar = this.refs["maskChar" + this.editableIndices[this.editIndex]]
            var typed = maskChar.typeValue(typedChar);

            if(typed) {
                this.editIndex++;
            }
        } else {
            console.warn("No more characters left to type.")
        }
    },

    render: function() {
        var self = this;

        self.maskChars = this.props.pattern.split("").map(function(patternChar, i){
            if(self.isCharEditable(patternChar)) {
                self.editableIndices.push(i);
            }
            return (
                <MaskChar sourceChar={patternChar} isEditable={self.isCharEditable(patternChar)} isActive={i === self.editIndex} ref={"maskChar" + i}/>
            )
        });

        var maskStyle = {
            fontSize : "25px",
            lineHeight : "50px",
            margin : "auto",
            padding : "10px"
        }

        return (
            <div className="Mask" style={maskStyle} onClick={this.handleKeyDown}>{this.maskChars}</div>
        )
    }
});

React.render( <Mask pattern={maskPattern} />, document.getElementById('container') );
