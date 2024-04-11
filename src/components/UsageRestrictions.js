import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import api from 'api';
import { formatPrice } from 'functions';
import AgeIcon from 'img/terms/age.svg';
import DepositIcon from 'img/terms/deposit.svg';
import GeographyIcon from 'img/terms/geography.svg';
import ExperienceIcon from 'img/terms/experience.svg';
import InsuranceIcon from 'img/terms/insurance.svg';
import Icon from './Icon';
import Section from './Section';
import SectionItem from './SectionItem';
import Separator from './Separator';

import theme from 'theme';

const mapRentLocations = {
	CITY: 'Только в городе',
	COUNTRY: 'По региону и области (краю)',
	WORLD: 'По всей стране (по согласованию региона)',
};

const UsageRestrictions = ({
	pledge,
	insurance,
	driversAge,
	rentLocations,
	openDepositModal,
	drivingExperience,
	sectionTitle = 'Условия аренды',
	...rest
}) => {
	
	return (
		<Section 
			style={styles.usageRestrictions}
			title={sectionTitle} 
			titleStyle={styles.title}
			{...rest}
		>
			{
				!!drivingExperience
				&&
					<SectionItem styles={styles.item} icon={
						() => 
							<ExperienceIcon width={32} height={32} />
					}>				
						Минимальный стаж — {''}
						<Text style={theme.styles.P1}>
							от {drivingExperience} {drivingExperience === 1 ? 'года' : 'лет'}
						</Text>
					</SectionItem>
			}
			{
				!!driversAge
				&&
					<SectionItem styles={styles.item} icon={
						() => 
							<AgeIcon width={32} height={32} />
					}>	
						Возраст водителя — {''}
						<Text style={theme.styles.P1}>
							от {driversAge} {driversAge === 1 ? 'года' : 'лет'}
						</Text>
					</SectionItem>
			}
			<SectionItem styles={styles.item} icon={
				() => 
					<GeographyIcon width={32} height={32} />
			}>	
				{mapRentLocations[rentLocations]}
			</SectionItem>	
			{
				pledge?.pledgePrice
				&&
					<SectionItem icon={
						() => 
							<DepositIcon width={32} height={32} />
					}>	
						Залог —
						<Text style={theme.styles.P1}>
							{` ${formatPrice(pledge.pledgePrice)} `}
						</Text>
						<TouchableOpacity
							onPress={openDepositModal}
						>
							<Icon
								name="question"
								color={theme.colors.blue}
								size={theme.normalize(16)}
							/>
						</TouchableOpacity>
					</SectionItem>
			}
			<SectionItem styles={styles.item} icon={
				() => 
					<InsuranceIcon width={32} height={32} />
			}>	
				Страхование
				{
					!insurance?.unavailable
					?
						<Text>
							{''} КАСКО
							{
								!insurance?.alreadyInsured
								?
									<>
										{' — '}
										<Text style={theme.styles.P1}>
											{insurance?.price || '?'} ₽ {''}
										</Text>
									</>
								:
									' включено '
							} 
							<TouchableOpacity
								onPress={() => (
									api.navigation.navigate(
										'InsurancePopup', 
										{ price: !insurance?.alreadyInsured ? insurance?.price : null }
									)
								)}
							>
								<Icon
									name="question"
									color={theme.colors.blue}
									size={theme.normalize(16)}
								/>
							</TouchableOpacity>
						</Text>
					: 
						<Text>
							{''} КАСКО недоступно
						</Text>
				}
			</SectionItem>
			<Separator 
				light 
				style={{ marginTop: 15, marginBottom: -20 }} 
			/>		
		</Section>
	);
};

export default React.memo(UsageRestrictions);

const styles = StyleSheet.create({
	usageRestrictions: {
		paddingBottom: 0,
		marginBottom: 0,
	},
	title: {
		marginBottom: 23,
	},
	questionTip: {
		marginLeft: 7,
		marginBottom: 3,
	},
	item: {
		marginBottom: theme.spacing(4)
	}
});
