var Bit = React.createClass({
  render: function () {
    var bit = this.props.bit;
    return (
      <div className={'bit ' + bit.type}>
        <div className='container'>
          <div className={'face front ' + bit.color}>
            <div className='content'>{bit.content}</div>
          </div>
        </div>
      </div>
    )
  }
});

var BitMap = ReactMeteor.createClass({

  templateName: "BitMap",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("bits");
  },

  getMeteorState: function() {
    return {
      bits: Bits.find().fetch()
    };
  },

  _renderBit: function (bit) {
    return <Bit bit={bit} />
  },

  render: function () {
    return (
      <div className='map'>{this.state.bits.map(this._renderBit)}</div>
    )
  }
});
