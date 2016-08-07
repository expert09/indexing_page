// @flow

class Content extends React.Component {
  
  render() {
    return (
      <tr><td>{this.props.content.tagname}</td><td>{this.props.content.content}</td></tr>
    );
  }

}