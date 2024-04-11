import React from 'react';
import { useField } from 'formik';
import Switch from '../../Switch';
import FormControlLabel from '../../FormControlLabel';

const FormikSwitch = ({ style, label, name, price, unit }) => {

	const [{ value }, , { setValue }] = useField(name);

	return (
		<FormControlLabel {...{ style, label, price, unit }}>
			<Switch onChange={setValue} {...{ value }} />
		</FormControlLabel>
	);
};

export default React.memo(FormikSwitch);
