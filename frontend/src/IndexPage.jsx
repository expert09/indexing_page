// @flow

import React from 'react';
import ReactAddons from 'react-addons';
import ReactAddonsUpdate from 'react-addons-update';
import ReactDOM from 'react-dom';

class IndexPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			newUrl: '',
			pages: [],
			contents: []
		};
		$.get(this.props.apiServer,
		  {},
		  function(pages) {
		  	this.setState({ pages: pages });
		  	this.forceUpdate();
		  }.bind(this),
		  'JSON'
		);
	}

	handleAddPage(e) {
		e.preventDefault();
	  	$.post(this.props.apiServer,
	  	  { page: { url: this.state.newUrl } },
	  	  function(data) {
	  	  	if (!data)
	  	  	  return false;
	  	  	var pages = ReactAddonsUpdate(this.state.pages, { $push: [data] });
  			this.setState({ pages: pages, newUrl: '' });
	  	  }.bind(this),
	  	  'JSON'
	  	);
	}

	inputPageChange(e) {
		this.setState({ newUrl : e.target.value });
	}

	handleSelPage(page) {
		event.preventDefault();
		this.setState({ loading: true });
		$.get(this.props.apiServer + '/' + page.id, 
		  { tags: ['h1', 'h2', 'h3'] },
		  function(contents) {
		  	this.setState({ contents: contents, loading: false });
		  }.bind(this),
		  'JSON'
		);
	}

	render() {
		return (
			<div className='row top-buffer'>
				<div className='col-xs-5'>
					<h2 className='title'>
			  	  		All URLs
			  	  	</h2>
					<form className='form-inline' onSubmit={this.handleAddPage.bind(this)}>
						<div className='form-group'>
							<input type='text' className='form-control'
						  		 placeholder='http(s)://www.domain.com/ ...' name='url'
						  		 value={this.state.newUrl} onChange={this.inputPageChange.bind(this)}>
						  	</input>
						</div>
						<div className='form-group'>
						  	<input type='submit' className='btn btn-primary' />
						</div>
					</form>
					<table className='table table-hover table-bordered'>
			  	  	  <thead>
			  	  	    <tr>
			  	  	      <th>url</th>
			  	  	    </tr>
			  	  	  </thead>
			  	  	  <tbody>
						{this.state.pages.map(function(page) {
			  	  	  	  	return <Page key={page.id} page={page} handleSelect={this.handleSelPage.bind(this)} />
			  	  	  	}.bind(this))}
		  	  	  	  </tbody>
		  	  	  	</table>
				</div>
				<div className='col-xs-2'>
				</div>
				<div className='col-xs-5'>
					<h2 className='title'>
			  	  		Tags { this.state.loading ? <span>loading ...</span> : '' }
			  	  	</h2>
			  	  	<table className='table table-hover table-bordered'>
			  	  	  <thead>
			  	  	    <tr>
			  	  	      <th>tagname</th>
			  	  	      <th>contents</th>
			  	  	    </tr>
			  	  	  </thead>
			  	  	  <tbody>
						{this.state.contents.map(function(content) {
			  	  	  	  	return <Content key={content.id} content={content} />
			  	  	  	}.bind(this))}
		  	  	  	  </tbody>
		  	  	  	</table>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
  <IndexPage apiServer='http://localhost:8000/api/v1/pages' />,
  document.getElementById('app')
);
