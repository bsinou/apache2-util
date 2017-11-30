'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

var root = '/api';



class FibuApp extends React.Component {


	constructor(props) {
		super(props);
		this.state = {accounts: [], attributes: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);	
	}
	

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'accounts', params: {size: pageSize}}]
		).then(accountCollection => {
			return client({
				method: 'GET',
				path: accountCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return accountCollection;
			});
		}).done(accountCollection => {
			this.setState({
				accounts: accountCollection.entity._embedded.accounts,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: accountCollection.entity._links});
		});
	}
	
	onCreate(newAccount) {
		follow(client, root, ['accounts']).then(accountCollection => {
			return client({
				method: 'POST',
				path: accountCollection.entity._links.self.href,
				entity: newAccount,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'accounts', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last != "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	
	onDelete(account) {
		client({method: 'DELETE', path: account._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}
	
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(accountCollection => {
			this.setState({
				accounts: accountCollection.entity._embedded.accounts,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: accountCollection.entity._links
			});
		});
	}
	
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}

	render() {
		return (
			<div>
				<CreateAccountDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				<AccountList accounts={this.state.accounts}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  onNavigate={this.onNavigate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}



class CreateAccountDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var newAccount = {};
		this.props.attributes.forEach(attribute => {
			newAccount[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newAccount);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field" />
			</p>
		);

		return (
			<div>
				<a href="#createAccount">Create</a>

				<div id="createAccount" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new account</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

class AccountList extends React.Component{

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}
	
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	
	render() {
		var accounts = this.props.accounts.map(account =>
			<Account key={account._links.self.href} account={account} onDelete={this.props.onDelete} />
		);

		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<table>
					<tbody>
						<tr>
							<th>Code</th>
							<th>Title</th>
							<th>Description</th>
							<th>Tax code</th>
							<th></th>
						</tr>
						{accounts}
					</tbody>
					<div>
						{navLinks}
					</div>
				</table>
			</div>
		)
	}
}

class Account extends React.Component{

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.account);
	}

	render() {
		return (
			<tr>
				<td>{this.props.account.code}</td>
				<td>{this.props.account.title}</td>
				<td>{this.props.account.description}</td>
				<td>{this.props.account.taxCode}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}


ReactDOM.render(
		<FibuApp />,
		document.getElementById('react')
)