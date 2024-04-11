import { getWorkingHoursText, checkIfVersionNeedsUpToDate } from '../src/functions';

jest.mock('react-native-device-info', () => {
    return {
        NativeEventEmitter: jest.fn(),
    }
});

jest.mock("@react-native-community/async-storage", () =>
  require("@react-native-community/async-storage/jest/async-storage-mock"),
);

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

describe('Working hours', () => {

    test('[0, 1, 2, 3, 4, 5, 6]: ПН-ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 1, 2, 3, 4, 5, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН-ВСК с 00-00 до 19-00')
    }),

    test('[0, 1, 2, 4, 5, 6]: ПН-СР, ПТ-ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 1, 2, 4, 5, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН-СР, ПТ-ВСК с 00-00 до 19-00')
    }),

    test('[0, 1, 3, 4, 6]: ПН-ВТ, ЧТ-ПТ, ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 1, 3, 4, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН-ВТ, ЧТ-ПТ, ВСК с 00-00 до 19-00')
    }),

    test('[0, 1, 3, 5, 6]: ПН-ВТ, ЧТ, СБ-ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 1, 3, 5, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН-ВТ, ЧТ, СБ-ВСК с 00-00 до 19-00')
    }),

    test('[0, 2, 3, 5, 6]: ПН, СР-ЧТ, СБ-ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 2, 3, 5, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН, СР-ЧТ, СБ-ВСК с 00-00 до 19-00')
    }),

    test('[0, 2, 6]: ПН, СР, ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 2, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН, СР, ВСК с 00-00 до 19-00')
    }),

    test('[0, 2, 5, 6]: ПН, СР, СБ-ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 2, 5, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН, СР, СБ-ВСК с 00-00 до 19-00')
    }),

    test('[0, 2, 3, 6]: ПН, СР-ЧТ, ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 2, 3, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН, СР-ЧТ, ВСК с 00-00 до 19-00')
    }),

    test('[0, 1, 2, 4, 6]: ПН-СР, ПТ, ВСК', () => {
        expect(getWorkingHoursText({
            days: [0, 1, 2, 4, 6],
            endTime: '19-00',
            startTime: '00-00',
        })).toEqual('* Рабочий график ПН-СР, ПТ, ВСК с 00-00 до 19-00')
    })
});

describe('Version updates', () => {

    test('0.9.5 < 1.0.0 - need to update', () => {
        expect(checkIfVersionNeedsUpToDate(
            '0.9.5', '1.0.0'
        )).toEqual(true)
    }),

    test('0.9.5 = 0.9.5 - no need to update', () => {
        expect(checkIfVersionNeedsUpToDate(
            '0.9.5', '0.9.5'
        )).toEqual(false)
    }),

    test('0.9.5 > 0.0.1 - no need to update', () => {
        expect(checkIfVersionNeedsUpToDate(
            '0.9.5', '0.0.1'
        )).toEqual(false)
    }),

    test('0.5.5 < 0.9.5 - need to update', () => {
        expect(checkIfVersionNeedsUpToDate(
            '0.5.5', '0.9.5'
        )).toEqual(true)
    }),

    test('0.5.5 > 0.4.5 - no need to update', () => {
        expect(checkIfVersionNeedsUpToDate(
            '0.5.5', '0.4.5'
        )).toEqual(false)
    })
});
