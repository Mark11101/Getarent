import * as Yup from 'yup';

export default Yup.object().shape({
    rentPricePerDay: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .positive('Цена должна быть положительной')
      .max(99999, 'Слишком большое число')
      .required('Обязательное поле'),
    twoDaysDiscount: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .min(0, 'Скидка не может быть отрицательной')
        .max(100, 'Скидка не может быть больше 100 процентов')
        .integer('Пожалуйста, введите целое значение'),
    threeDaysDiscount: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .min(0, 'Скидка не может быть отрицательной')
        .max(100, 'Скидка не может быть больше 100 процентов')
        .integer('Пожалуйста, введите целое значение'),
    fiveDaysDiscount: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .min(0, 'Скидка не может быть отрицательной')
        .max(100, 'Скидка не может быть больше 100 процентов')
        .integer('Пожалуйста, введите целое значение'),
    weekDiscount: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .min(0, 'Скидка не может быть отрицательной')
        .max(100, 'Скидка не может быть больше 100 процентов')
        .integer('Пожалуйста, введите целое значение'),
    twoWeeksDiscount: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .min(0, 'Скидка не может быть отрицательной')
        .max(100, 'Скидка не может быть больше 100 процентов')
        .integer('Пожалуйста, введите целое значение'),
    monthDiscount: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .min(0, 'Скидка не может быть отрицательной')
        .max(100, 'Скидка не может быть больше 100 процентов')
        .integer('Пожалуйста, введите целое значение'),
    weekDiscount: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .min(0, 'Скидка не может быть отрицательной')
      .max(100, 'Скидка не может быть больше 100 процентов')
      .integer('Пожалуйста, введите целое значение'),
    monthDiscount: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .min(0, 'Скидка не может быть отрицательной')
      .max(100, 'Скидка не может быть больше 100 процентов')
      .integer('Пожалуйста, введите целое значение'),
    dailyMilageLimit: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .positive('Ограничение по пробегу должно быть больше 0')
      .max(99999, 'Слишком большое число')
      .required('Обязательное поле'),
    weeklyMilageLimit: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .positive('Ограничение по пробегу должно быть больше 0')
      .max(99999, 'Слишком большое число')
      .required('Обязательное поле'),
    monthlyMilageLimit: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .positive('Ограничение по пробегу должно быть больше 0')
      .max(99999, 'Слишком большое число')
      .required('Обязательное поле'),
    driversAge: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .max(100, 'Слишком большое число')
      .required('Обязательное поле'),
    drivingExperience: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .max(100, 'Слишком большое число')
      .required('Обязательное поле'),
    pledgePrice: Yup.number()
      .transform(value => (isNaN(value) ? null : value))
      .nullable()
      .integer('Пожалуйста, введите целое значение')
      .max(99999, 'Слишком большое число'),
    pledgeMaxTerm: Yup.number()
        .transform(value => (isNaN(value) ? null : value))
        .nullable()
        .integer('Пожалуйста, введите целое значение')
        .max(999, 'Слишком большое число'),
    // CHILD_SEAT: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // NAVIGATOR: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // REGISTRATOR: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // ROOF_RACK: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // FRIDGE: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // BIKE_RACK: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // SNOWBOARD_RACK: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // SKIING_RACK: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // RADAR_DETECTOR: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   wholeRentPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .max(99999, 'Слишком большое число')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    //   dailyPrice: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .min(0, 'Цена не может быть отрицательной')
    //       .max(99999, 'Слишком большое число')
    //       .integer('Введите целое число')
    //       .required('Поле обязательно для заполнения'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // additionalKmPrice: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   price: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .required('Поле обязательно для заполнения')
    //       .integer('Введите целое число')
    //       .min(0, 'Цена не может быть отрицательной')
    //       .max(99999, 'Слишком большое число'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // afterRentWashingPrice: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   price: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .required('Поле обязательно для заполнения')
    //       .integer('Введите целое число')
    //       .min(0, 'Цена не может быть отрицательной')
    //       .max(99999, 'Слишком большое число'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // offHoursReturnPrice: Yup.object().shape({
    //   checked: Yup.boolean(),
    //   price: Yup.mixed().when('checked', {
    //     is: true,
    //     then: Yup.number()
    //       .required('Поле обязательно для заполнения')
    //       .integer('Введите целое число')
    //       .min(0, 'Цена не может быть отрицательной')
    //       .max(99999, 'Слишком большое число'),
    //     otherwise: Yup.mixed(),
    //   }),
    // }),
    // distancePackages: Yup.array().of(
    //   Yup.object().shape({
    //     discount: Yup.number().min(0, 'Цена не может быть отрицательной'),
    //   }),
    // ),
    // action: Yup.string().strip(),
    // driversAge: Yup.number()
    //   .min(18, 'Минимальный возраст водителя - 18 лет'),
    // depositValue: Yup.number()
    //   .required(''),
});