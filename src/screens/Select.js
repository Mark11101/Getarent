import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';

import {
	Icon,
	Header,
	Separator,
	IconInput,
	SafeAreaView,
	DismissKeyboardWrapper,
} from 'components';
import api from 'api';
import { useListEmpty } from 'hooks';

import theme from 'theme';

const keyExtractor = o => String(o.value);

const emptyProps = {
	icon: 'error',
	text: 'Ничего не найдено',
	iconSize: theme.normalize(92),
	iconColor: theme.colors.lightGrey,
};

const Select = ({
	route: {
		params: { 
			title, 
			value, 
			search,
			options, 
			callback, 
			black = false, 
		} = {},
	},
}) => {

	const [data, setData] = useState([]);
	const [query, setQuery] = useState('');
	
	const listEmptyProps = useListEmpty(emptyProps);

	const renderItem = useCallback(
		({ index, item }) => (
			<>
				<Option
					labelStyle={[
						black && { color: theme.colors.white },
						{ marginLeft: 10 },
					]}
					selected={item.value === value}
					{...{ callback }}
					{...item}
				/>
				{!(
					index === data.length - 1 ||
					index === options.length - 1
				) && (
					<View style={{ paddingHorizontal: 25 }}>
						<Separator light />
					</View>
				)}
			</>
		),
		[value, callback]
	);

	useEffect(() => {

		if (!search || !query) {
			return setData(options);
		};

		const re = new RegExp(query, 'i');

		const filtered = options
			.filter(({ label }) => label.search(re) === 0)
			.concat(options.filter(({ label }) => label.search(re) > 0));

		setData(filtered);

	}, [search, options, query]);

	return (
		<DismissKeyboardWrapper style={theme.styles.container}>
			<SafeAreaView
				top
				style={[styles.container, black && styles.blackBG]}
			>
				<Header white={black} {...{ title }} />
				{!!search && (
					<IconInput
						style={styles.search}
						inputStyle={black && { color: theme.colors.white }}
						icon="search"
						iconColor={
							black ? theme.colors.white : theme.colors.lightCyan
						}
						placeholder={
							typeof search === 'string' ? search : undefined
						}
						value={query}
						onChangeText={setQuery}
					/>
				)}
				<FlatList
					style={theme.styles.flex}
					contentInset={{ bottom: 60 }}
					keyboardShouldPersistTaps="handled"
					{...{ data, keyExtractor, renderItem }}
					{...listEmptyProps}
				/>
			</SafeAreaView>
		</DismissKeyboardWrapper>
	);
};

export default Select;

const Option = React.memo(function Option({
	label,
	value,
	selected,
	callback,
	labelStyle,
}) {

	return (
		<TouchableOpacity
			style={styles.option}
			onPress={() => {
			
				api.navigation.goBack();

				if (callback) {
					callback(value, label);
				}
			}}
		>
			<Text style={[theme.styles.P1R, labelStyle]}>
				{label}
			</Text>
			{selected && (
				<Icon
					name="checkmark"
					size={theme.normalize(16)}
					color={theme.colors.blue}
				/>
			)}
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
	},
	blackBG: {
		backgroundColor: '#282c34',
	},
	search: {
		marginHorizontal: theme.spacing(6),
		marginBottom: theme.spacing(4),
	},
	option: {
		height: theme.normalize(56),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.spacing(6),
	},
});
