export const hostSelector = state => state.host
export const hostPreferencesSelector = state => hostSelector(state).preferences
export const hostWorkingHoursSelector = state => hostPreferencesSelector(state).workingHours
export const hostBioSelector = state => hostPreferencesSelector(state).bio
export const useHostTrademarkSelector = state => state.profile.useTrademark
export const hostTrademarkSelector = state => state.profile.trademark
export const hostIfTrademarkSelector = state => useHostTrademarkSelector(state) && hostTrademarkSelector(state)
export const hostPaymentMethodSelector = state => hostSelector(state).paymentMethod
export const hostLoaderSelector = state => hostSelector(state).loading
