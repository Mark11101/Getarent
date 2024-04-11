import { REGISTRATION_STEPS } from "../../constants/guestRegistration"

export const guestSelector = state => state.guest
export const guestPassportSelector = state => guestSelector(state).passport
export const guestLicenseSelector = state => guestSelector(state).driversLicense
export const guestLoaderSelector = state => guestSelector(state).loading

/* Complex */
export const passedStepsSelector = state => {
	const passport = guestPassportSelector(state)
	const license = guestLicenseSelector(state)

	return [
		REGISTRATION_STEPS.REGISTRATION,
		license.serialNumber ? REGISTRATION_STEPS.DRIVER_LICENSE : null,
		passport.serialNumber ? REGISTRATION_STEPS.PASSPORT : null
	].filter(Boolean)
}
