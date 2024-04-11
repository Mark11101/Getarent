import React from 'react';

import { NavigationProgress } from 'components';
import theme from 'theme';
import { StyleSheet } from 'react-native';
import {getPsoTotalSteps, getPsoConfig,
} from './config';

export default function PsoNavigationProgress({ role, stepName, insured }) {
	const total = getPsoTotalSteps(role, insured);
	const current = getPsoConfig(role, insured)[stepName].step;

	return (
		<NavigationProgress
			style={styles.progress}
			total={total}
			current={current}
		/>
	);
}

const styles = StyleSheet.create({
	progress: {
		marginVertical: theme.spacing(6),
	},
});
