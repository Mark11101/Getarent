import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import s from './styles';
import theme from 'theme';

const MileageLimits = ({ 
	mileageLimit,
	rentDuration,
	dailyMilageLimit, 
	additionalKmPrice,
	selectedDistantPackage,
	styles,
}) => {

	const [kmQuantity, setKmQuantity] = useState(0);

	useEffect(() => {

		selectedDistantPackage 
		?
			setKmQuantity(selectedDistantPackage.kmQuantity)
		:
			setKmQuantity(0)

	}, [selectedDistantPackage])
	
	return (
		<View style={styles}>
			{
				!!dailyMilageLimit
				&&
					<Text style={s.limitRow}>
						Включено пробега в день — 
						<Text style={theme.styles.P1}>
							{
								kmQuantity === 'infinity'
								?
									' неограниченно'
								:
									' ' + (dailyMilageLimit + kmQuantity) + ' км'
							}
						</Text>
					</Text>
			}
			{
				!!mileageLimit
				&&
					<Text style={[s.limitRow, { marginBottom: 2 }]}>
						Включено в поездку — 
						<Text style={theme.styles.P1}>
							{
								kmQuantity === 'infinity'
								?
									' неограниченно'
								:
									' ' + (mileageLimit + kmQuantity * rentDuration) + ' км'
							}
						</Text>
					</Text>
			}
			{
				!!additionalKmPrice &&
				kmQuantity !== 'infinity' &&
				(!!dailyMilageLimit || !!mileageLimit)
				&&
					<Text style={s.helpText}>
						* Перерасход 1 км - {additionalKmPrice}₽
					</Text>
			}
		</View>
	)
};

export default MileageLimits;
