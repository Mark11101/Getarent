import { useField } from 'formik';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Slider from '../../Slider';

const FormikSlider = ({ label, name, onStart, onEnd: _onEnd, ...rest }) => {

	const [field, , helpers] = useField(name);
	
	const valueRef = useRef(field.value);
	const setValueRef = useRef(helpers.setValue);
	
	const [value, setValue] = useState(field.value);

	const onEnd = useCallback(() => {

		setValueRef.current(valueRef.current);
		_onEnd();
		
	}, [_onEnd]);

	useEffect(() => {
		setValueRef.current = helpers.setValue;
	}, [helpers.setValue]);

	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	useEffect(() => setValue(field.value), [field.value]);

	return (
		<Slider
			{...rest}
			title={label}
			onChange={setValue}
			{...{ value, onStart, onEnd }}
		/>
	);
};

export default React.memo(FormikSlider);
