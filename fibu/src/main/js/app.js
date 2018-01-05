// Force pre-declaration of variables
'use strict';

// TPs
const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');

// Own libraries
const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"
const stompClient = require('./websocket-listener')


// Api base path
var root = '/api';

class AccountTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {accounts: [], attributes: [], pageSize: 100, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);	
		this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
		this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
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
				this.links = accountCollection.entity._links;
				return accountCollection;
			});
		}).then(accountCollection => {
			this.page = accountCollection.entity.page;
			return accountCollection.entity._embedded.accounts.map(account =>
					client({
						method: 'GET',
						path: account._links.self.href
					})
			);
		}).then(accountPromises => {
			return when.all(accountPromises);
		}).done(accounts => {
			this.setState({
				page: this.page,
				accounts: accounts,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links});
		});
	}
	
	onCreate(newAccount) {
		follow(client, root, ['accounts']).done(response => {
			client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newAccount,
				headers: {'Content-Type': 'application/json'}
			})
		});
	}
	
	onUpdate(account, updatedAccount) {
		client({
			method: 'PUT',
			path: account.entity._links.self.href,
			entity: updatedAccount,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': account.headers.Etag
			}
		}).done(response => {
			// let the websocket handler update the state
			// this.loadFromServer(this.state.pageSize);
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
						account.entity._links.self.href + '. Your copy is stale.');
			} else if (response.status.code === 403) {
				alert('ACCESS DENIED: You are not authorized to update ' +
						account.entity._links.self.href);
			} else {
				alert('Error: cannot update ' +
						account.entity._links.self.href);
			}
		});
	}
	
	onDelete(account) {
		client({method: 'DELETE', path: account.entity._links.self.href})
			.done(
				response => {/* done via socket */}, 
				response => {
					if (response.status.code === 403) {
						alert('ACCESS DENIED: You are not authorized to delete ' +
								account.entity._links.self.href);
					} else {
						alert('Error: cannot delete ' +
								account.entity._links.self.href);
					}
				}
			);
		}
		
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(accountCollection => {
			this.links = accountCollection.entity._links;
			this.page = accountCollection.entity.page;
			return accountCollection.entity._embedded.accounts.map(account =>
					client({
						method: 'GET',
						path: account._links.self.href
					})
			);
		}).then(accountPromises => {
			return when.all(accountPromises);
		}).done(accounts => {
			this.setState({
				accounts: accounts,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	refreshAndGoToLastPage(message) {
		follow(client, root, [{
			rel: 'accounts',
			params: {size: this.state.pageSize}
		}]).done(response => {
			if (response.entity._links.last !== undefined) {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		})
	}

	refreshCurrentPage(message) {
		follow(client, root, [{
			rel: 'accounts',
			params: {
				size: this.state.pageSize,
				page: this.state.page.number
			}
		}]).then(accountCollection => {
			this.links = accountCollection.entity._links;
			this.page = accountCollection.entity.page;
			return accountCollection.entity._embedded.accounts.map(account => {
				return client({
					method: 'GET',
					path: account._links.self.href
				})
			});
		}).then(accountPromises => {
			return when.all(accountPromises);
		}).then(accounts => {
			this.setState({
				page: this.page,
				accounts: accounts,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
		stompClient.register([
			{route: '/topic/newAccount', callback: this.refreshAndGoToLastPage},
			{route: '/topic/updateAccount', callback: this.refreshCurrentPage},
			{route: '/topic/deleteAccount', callback: this.refreshCurrentPage}
		]);
	}

	render() {
		return (
			<div>
				<CreateAccountDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				<AccountList accounts={this.state.accounts}
								links={this.state.links}
								pageSize={this.state.pageSize}
								attributes={this.state.attributes}
								onNavigate={this.onNavigate}
								onUpdate={this.onUpdate}
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
};


class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var updatedAccount = {};
		this.props.attributes.forEach(attribute => {
			updatedAccount[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onUpdate(this.props.account, updatedAccount);
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
// <p key={this.props.account.entity[attribute]}>
		<p key={attribute}>
					<input 
						type="text"
						placeholder={attribute}
						defaultValue={this.props.account.entity[attribute]}
						ref={attribute} 
						className="field" />
				</p>
		);

		var dialogId = "updateAccount-" + this.props.account.entity._links.self.href;

		return (
			<div key={this.props.account.entity._links.self.href}>
				<a href={"#" + dialogId}>Update</a>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Update an account</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
};

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
							<Account 
								key={account.entity._links.self.href} 
								account={account} 
								attributes={this.props.attributes}
							  	onUpdate={this.props.onUpdate}
								onDelete={this.props.onDelete}/>	
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
				</table>
				<div>
					{navLinks}
					<label>Change number of result per page: </label>
					<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				</div>
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
				<td>{this.props.account.entity.code}</td>
				<td>{this.props.account.entity.title}</td>
				<td>{this.props.account.entity.description}</td>
				<td>{this.props.account.entity.taxCode}</td>
				<td>
				<UpdateDialog account={this.props.account}
							  attributes={this.props.attributes}
							  onUpdate={this.props.onUpdate}/>
				</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}


ReactDOM.render(
		<AccountTable />,
		document.getElementById('react')
)