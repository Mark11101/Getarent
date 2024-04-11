const PsoSteps = {
	PREVIEW: {
		step: 1,
		screen: 'PreviewStep',
		prev: 'RentRoom',
		next: 'GeneralStep',
	},
	GENERAL: {
		step: 2,
		screen: 'GeneralStep',
		prev: 'PreviewStep',
		next: 'MilageFuelStep',
		photos: [
			{
				sequentialIdWithinStep: 9,
				icon: 'car-windshield',
				hint: 'Лобовое стекло',
			},
			{
				sequentialIdWithinStep: 0,
				icon: 'car-face',
				hint: 'ТС спереди',
			},
			{
				sequentialIdWithinStep: 1,
				icon: 'car-face-left',
				hint: 'Диагональ с левого угла переднего бампера',
			},
			{
				sequentialIdWithinStep: 2,
				icon: 'car-left',
				hint: 'ТС  с левой стороны',
			},

			{
				sequentialIdWithinStep: 12,
				icon: 'car-interior-door',
				hint: 'Передняя часть салона, вид со стороны двери',
			},
			{
				sequentialIdWithinStep: 13,
				icon: 'car-interior',
				hint: 'Передняя часть салона, вид со стороны заднего сидения',
			},
			{
				sequentialIdWithinStep: 14,
				icon: 'car-interior-back',
				hint: 'Задняя часть салона',
			},
			{
				sequentialIdWithinStep: 3,
				icon: 'car-back-left',
				hint: 'Диагональ с левого угла заднего бампера',
			},
			{
				sequentialIdWithinStep: 4,
				icon: 'car-back',
				hint: 'ТС сзади',
			},
			{
				sequentialIdWithinStep: 11,
				icon: 'car-trunk',
				hint: 'Открытый багажник',
			},
			{
				sequentialIdWithinStep: 5,
				icon: 'car-back-right',
				hint: 'Диагональ с правого угла заднего бампера',
			},
			{
				sequentialIdWithinStep: 6,
				icon: 'car-right',
				hint: 'ТС справа',
			},
			{
				sequentialIdWithinStep: 7,
				icon: 'car-face-right',
				hint: 'Диагональ с правого угла переднего бампера',
			},
			{
				sequentialIdWithinStep: 10,
				icon: 'car-roof',
				hint: 'Крыша',
			},
		],
	},
	MILAGE_AND_FUEL: {
		step: 3,
		screen: 'MilageFuelStep',
		prev: 'GeneralStep',
		photos: [
			{
				sequentialIdWithinStep: 0,
				icon: 'car-odometer',
				hint: 'Одометр',
			},
		],
	},
};

export const GuestPso = {
	DEFECTS_AND_STAINS: {
		step: 1,
		screen: 'DefectsStainsStep',
		next: 'MilageFuelStep',
		prev: 'RentRoom',
	},
	MILAGE_AND_FUEL: {
		step: 2,
		screen: 'MilageFuelStep',
		prev: 'DefectsStainsStep',
		photos: [
			{
				sequentialIdWithinStep: 0,
				icon: 'car-odometer',
				hint: 'Одометр',
			},
		],
	},
};
export const HostPso = {
	...PsoSteps,
	ADDITIONAL: {
		step: 7,
		screen: 'AdditionalStep',
		prev: 'RentRoom',
	},
};

export const HostPsoWithoutInsurance = {
	MILAGE_AND_FUEL: {
		step: 1,
		screen: 'MilageFuelStep',
		prev: 'RentRoom',
		photos: [
			{
				sequentialIdWithinStep: 0,
				icon: 'car-odometer',
				hint: 'Одометр',
			},
		],
	}
}

export const getPsoConfig = (role, insured = false) => {
	if (role === 'GUEST') {
		return GuestPso;
	}

	if (role === 'HOST') {
		if (insured) {
			return HostPso;
		}

		return HostPsoWithoutInsurance;
	}
}

export const getPsoTotalSteps = (role, insured = false) => {
	if (role === 'GUEST') {
		return GUEST_PSO_TOTAL_STEPS;
	}

	if (role === 'HOST') {
		if (insured) {
			return HOST_PSO_TOTAL_STEPS;
		}

		return HOST_PSO_WITHOUT_INSURANCE_TOTAL_STEPS;
	}
}

export const GUEST_PSO_TOTAL_STEPS = 2;
export const HOST_PSO_TOTAL_STEPS = 3;

export const HOST_PSO_WITHOUT_INSURANCE_TOTAL_STEPS = 1;
