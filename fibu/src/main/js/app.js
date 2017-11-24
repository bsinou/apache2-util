const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class FibuApp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {accounts: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/accounts'}).done(response => {
			this.setState({accounts: response.entity._embedded.accounts});
		});
	}

	render() {
		return (
			<AccountList accounts={this.state.accounts}/>
		)
	}
}

class AccountList extends React.Component{
	render() {
		var accounts = this.props.accounts.map(account =>
			<Account key={accounts._links.self.href} account={account}/>
		);
		alert('here')
		console.log('et hop')
		return (
			<table>
				<tbody>
					<tr>
						<th>Code</th>
						<th>Title</th>
						<th>Description</th>
						<th>Tax code</th>
						
					</tr>
					{accounts}
				</tbody>
			</table>
		)
	}
}

class Account extends React.Component{
	render() {
		return (
			<tr>
				<td>code</td>
				<td>title</td>
				<td>description</td>
				<td>taxCode</td>
//				<td>{this.props.account.code}</td>
//				<td>{this.props.account.title}</td>
//				<td>{this.props.account.description}</td>
//				<td>{this.props.account.taxCode}</td>
			</tr>
		)
	}
}

ReactDOM.render(
		<FibuApp />,
		document.getElementById('react')
)