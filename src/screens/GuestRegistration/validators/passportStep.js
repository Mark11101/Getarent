import * as Yup from 'yup'
import { tenDigitNumberExp, warns } from './lib'

const passportStepSchema = Yup.object().shape({
	serialNumber: Yup.string()
		.required('Введите серию и номер')
		.matches(tenDigitNumberExp, 'Введите корректные серию и номер'),
	
	registrationAddress: Yup.string().required(
		'Введите адрес регистрации'
	),
	
	dateOfIssue: Yup.date()
		.format('dd.MM.yyyy')
		.typeError(warns.enterCorrectDate)
		.required('Введите дату выдачи паспорта')
		.max(new Date(), warns.enterCorrectDate),

	selfiePhoto: Yup.object().shape({
		key: Yup.string().required(
			'Пожалуйста, загрузите ваше фото с паспортом'
		)
	}),

	frontSidePhoto: Yup.object().shape({
		key: Yup.string().required(
			'Пожалуйста, загрузите главный разворот паспорта'
		)
	}),

	registrationSidePhoto: Yup.object().shape({
		key: Yup.string().required(
			'Пожалуйста, загрузите фото регистрации'
		)
	})
})

export default passportStepSchema
