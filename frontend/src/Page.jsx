// @flow

class Page extends React.Component {
  
  handleSelect(e) {
  	this.props.handleSelect(this.props.page);
  }

  render() {
    return (
      <tr><td onClick={this.handleSelect.bind(this)} >{this.props.page.url}</td></tr>
    );
  }

}

export default Page;