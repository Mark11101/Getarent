import React from 'react';
import { TextInputMask } from 'react-native-masked-text';
import FormikInput from './FormikInput';

const FormikMaskedInput = (props) => {
	return <FormikInput {...{ RenderInput: TextInputMask, ...props }} />;
};

export default React.memo(FormikMaskedInput);
