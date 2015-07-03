// experimenting with React, only in this component
var DebugErrors = ReactMeteor.createClass({

  templateName: "DebugErrors",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("errors");
  },

  getMeteorState: function() {
    return {
      errors: Errors.find().fetch()
    }
  },

  _showError: function (error) {
    return (
      <tr>
        <td>{(new Date(error.dateTimeStamp)).toString()}</td>
        <td>{error.action}</td>
        <td>{error.message}</td>
      </tr>
    )
  },

  render: function () {
    return (
      <pre className='errors'>
        <h2>Errors:</h2>
        <table>
          <thead>
            <tr>
              <th>DateTime</th>
              <th>Action</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>{this.state.errors.map(this._showError)}</tbody>
        </table>
      </pre>
    );
  }
});