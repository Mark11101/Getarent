import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

import { Header } from 'components';

import theme from 'theme';

const FeeInfo = () => {

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<View>
				<Header title="Зачем нужна комиссия сервиса?" />
				<View style={styles.list}>
					<Text style={styles.description}>
						Мы обеспечиваем безопасность вашей аренды:
					</Text>

					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								страхуем поездку от повреждений и угона с
								франшизой 20 000 рублей
							</Text>
						</Text>
					</View>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								оказываем круглосуточную поддержку и помощь на
								дорогах
							</Text>
						</Text>
					</View>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								страхуем от несчастных случаев на сумму 150 000
								рублей
							</Text>
						</Text>
					</View>
					<View style={styles.listRow}>
						<View style={styles.block} />
						<Text style={styles.text}>
							<Text style={theme.styles.P1R}>
								обеспечиваем безопасность платежей и возврата в
								случае отмены
							</Text>
						</Text>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default FeeInfo;

const styles = StyleSheet.create({
	block: {
		backgroundColor: theme.colors.lightCyan,
		height: theme.normalize(4),
		marginRight: theme.spacing(3),
		top: theme.normalize(12),
		width: theme.normalize(4),
	},
	description: {
		...theme.styles.P1R,
		marginBottom: theme.spacing(6),
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(12),
	},
	listRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: theme.spacing(6),
	},
});
