import React from 'react';
import { BackHandler } from 'react-native';

export default class AndroidBackHandler extends React.PureComponent {

	handleBackPress = () => this.props.onBackPress();

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(
			'hardwareBackPress',
			this.handleBackPress
		);
	}
	
	render() {
		return null;
	}
}
