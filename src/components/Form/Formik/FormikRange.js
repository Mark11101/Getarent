import React from 'react';
import { useField } from 'formik';
import Range from '../../Range';

const FormikRange = ({ style, name, name2, ...rest }) => {

	const [{ value }, , { setValue }] = useField(name);
	const [{ value: value2 }, , { setValue: onChange2 }] = useField(name2);

	return (
		<Range
			onChange={setValue}
			{...rest}
			{...{ value, value2, onChange2 }}
		/>
	);
};

export default React.memo(FormikRange);
