import React from 'react';
import {Route} from 'react-router-dom';

export const App = () => (
	<>
		<Route exact path="/" component={() => <div>HOME</div>}/>
		<Route path="/about" component={() => <div>ABOUT</div>}/>
	</>
);

export const Login = () => (
	<Route exact path="/login" component={() => <div>LOGIN</div>}/>
);
