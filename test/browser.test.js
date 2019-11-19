import test from 'ava';
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {render, mount} from 'enzyme';
import {App, Login, DashboardLogin, DashboardMain} from './fixtures/app';

test('creates a browser history', t => {
	const {history} = require('../index');
	t.false('index' in history);
	t.false('entries' in history);
});

test('renders a BrowserRouter', t => {
	const {BrowserRouter} = require('../index');
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<App/>
		</BrowserRouter>
	);

	const wrapper = render(<BrowserComponent/>);
	t.true(wrapper.text().includes('HOME'));
	t.false(wrapper.text().includes('ABOUT'));
});

test('accepts custom history object', t => {
	const {BrowserRouter} = require('../index');
	const history = createBrowserHistory();
	history.unicorn = 42;
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<Route path="/" render={({history: innerHistory}) => <>{innerHistory.unicorn}</>}/>
			</div>
		</BrowserRouter>
	);

	const wrapper = render(<BrowserComponent history={history}/>);
	t.true(wrapper.text().includes('42'));
});

test('allows access to specified path if authenticated', t => {
	const {BrowserRouter, AuthenticatedRoute, history} = require('../');
	history.location.pathname = '/about';
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<AuthenticatedRoute
					exact
					isAuthenticated
					path="/about"
					component={App}
				/>
				<Login/>
			</div>
		</BrowserRouter>
	);

	const wrapper = mount(<BrowserComponent/>);

	t.true(wrapper.text().includes('ABOUT'));
});

test('redirects to `/login` if not authenticated', t => {
	const {BrowserRouter, AuthenticatedRoute, history} = require('../');
	history.location.pathname = '/test';
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<AuthenticatedRoute
					exact
					path="/"
					isAuthenticated={false}
					component={App}
				/>
				<Login/>
			</div>
		</BrowserRouter>
	);

	const wrapper = mount(<BrowserComponent/>);

	t.true(wrapper.text().includes('LOGIN'));
});

test('AuthenticatedRoute login redirect works for nested routes', t => {
	const {BrowserRouter, AuthenticatedRoute, history} = require('../');
	history.location.pathname = '/dashboard/test';
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<AuthenticatedRoute
					exact
					path="/dashboard/:dashboardParams"
					isAuthenticated={false}
					component={App}
				/>
				<Login/>
			</div>
		</BrowserRouter>
	);

	const wrapper = mount(<BrowserComponent/>);

	t.true(wrapper.text().includes('LOGIN'));
});

test('AuthenticatedRoute redirects to Login for nested routes in nested routing', t => {
	const {BrowserRouter, AuthenticatedRoute, history} = require('../');
	history.location.pathname = '/dashboard/main';
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<AuthenticatedRoute
					exact
					path="/dashboard/:dashboardParams"
					isAuthenticated={false}
					component={App}
				>
					<Switch>
						<DashboardMain/>
					</Switch>
				</AuthenticatedRoute>
				<Login/>
			</div>
		</BrowserRouter>
	);

	const wrapper = mount(<BrowserComponent/>);

	t.true(wrapper.text().includes('LOGIN'));
});

test('AuthenticatedRoute allows access to nested routes in nested routing', t => {
	const {BrowserRouter, AuthenticatedRoute, history} = require('../');
	history.location.pathname = '/dashboard/main';
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<AuthenticatedRoute
					exact
					isAuthenticated
					path="/dashboard/:dashboardParams"
					component={App}
				>
					<Switch>
						<DashboardMain/>
					</Switch>
				</AuthenticatedRoute>
				<Login/>
			</div>
		</BrowserRouter>
	);

	const wrapper = mount(<BrowserComponent/>);

	t.true(wrapper.text().includes('DASHBOARD MAIN'));
});

test('AuthenticatedRoute `matchPath` positive allows access to `loginPath` as nested route', t => {
	const {BrowserRouter, AuthenticatedRoute, history} = require('../');
	history.location.pathname = '/dashboard/login';
	const BrowserComponent = props => (
		<BrowserRouter {...props}>
			<div>
				<AuthenticatedRoute
					exact
					isAuthenticated={false}
					path="/dashboard/:dashboardParams"
					loginPath="/dashboard/login"
				>
					<DashboardMain/>
					<DashboardLogin/>
				</AuthenticatedRoute>
			</div>
		</BrowserRouter>
	);

	const wrapper = mount(<BrowserComponent/>);

	t.true(wrapper.text().includes('DASHBOARD LOGIN'));
});
