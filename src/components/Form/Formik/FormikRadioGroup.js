import React from 'react';
import { useField } from 'formik';
import RadioGroup from '../../RadioGroup';

const FormikRadioGroup = ({ style, name, ...rest }) => {

	const [{ value }, , { setValue }] = useField(name);

	return <RadioGroup {...rest} onChange={setValue} {...{ value }} />;
};

export default React.memo(FormikRadioGroup);
