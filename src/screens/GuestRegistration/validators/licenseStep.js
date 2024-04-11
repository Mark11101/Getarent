import * as Yup from 'yup'
import { fioRegExp, warns } from './lib'
import { differenceInYears } from 'date-fns'

const currentYear = new Date().getFullYear()

const licenseStepSchema = sameYear => Yup.object().shape({
	userData: Yup.object().shape({
		firstName: Yup.string()
			.required('Введите имя')
			.matches(fioRegExp, warns.onlyRussionSymbols),

		lastName: Yup.string()
			.required('Введите фамилию')
			.matches(fioRegExp, warns.onlyRussionSymbols),

		midName: Yup.string()
			.required('Введите отчество')
			.matches(fioRegExp, warns.onlyRussionSymbols),
			
		birthDate: Yup.date()
			.format('dd.MM.yyyy')
			.typeError(warns.enterCorrectDate)
			.required('Введите дату рождения')
			.test(
				'isAdulthood',
				'Сервис доступен лицам 18+',
				value => differenceInYears(new Date(), value) > 17
			)
			.max(new Date(), warns.enterCorrectDate)
	}),

	driversLicense: Yup.object().shape({
		serialNumber: Yup.string()
			.required('Введите серию и номер ВУ')
			.length(10, 'Введите корректные серию и номер'),
		
		dateOfIssue: Yup.date()
			.format('dd.MM.yyyy')
			.typeError(warns.enterCorrectDate)
			.required('Введите дату выдачи ВУ')
			.max(new Date(), warns.enterCorrectDate),
		
		frontSidePhoto: Yup.object().shape({
			key: Yup.string().required(
				'Пожалуйста, загрузите фото лицевой стороны ВУ'
			),
		}),
	
		reverseSidePhoto: Yup.object().shape({
			key: Yup.string().required(
				'Пожалуйста, загрузите фото обратной стороны ВУ'
			),
		}),

		...(sameYear ? {} : {
			firstLicenseIssueYear: Yup.number()
				.required('Введите год')
				.min(1960, 'Принимаются права от 1960 года')
				.max(currentYear - 2, 'Минимальный стаж - 2 года')
		})
	})
})

export default licenseStepSchema
