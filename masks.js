var maskPattern = "MM/DD/YY";
Mousetrap.bind('4', function() { console.log("4444"); });

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
    this.setState({
      value : char,
      isFilled : true
    });
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

  maskChars : [],

  editableIndices : [],

  editIndex : null,

  componentDidMount: function() {
    Mousetrap.bind('*', this.handleKeyDown);
  },

  componentWillUnmount: function() {
    Mousetrap.unbind('*', this.handleKeyDown);
  },

  handleKeyDown : function(e) {
    console.log("keydownnnn");
    var typedChar = String.fromCharCode(e.which);
    this.refs["maskChar" + this.editIndex].typeValue("X");
    this.editIndex++;
  },

  render: function() {
    var self = this;

    self.maskChars = this.props.pattern.split("").map(function(patternChar, i){
      if(self.isCharEditable(patternChar)) {
        self.editableIndices.push(i);
        
        if(self.editIndex === null) {
          self.editIndex = self.editableIndices[0];
        }
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
      <div className="Mask" style={maskStyle}>
        {this.maskChars}
      </div>
    )
  }
});

React.render(
  <Mask pattern={maskPattern} />,
  document.getElementById('container')
);
