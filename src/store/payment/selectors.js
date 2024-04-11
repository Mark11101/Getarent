export const paymentSelector = state => state.payment || {}
export const paymentCardSelector = state => paymentSelector(state).paymentCard
