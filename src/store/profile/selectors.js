import { ROLE } from "../../constants/roles"
import { SCORING_STATUS } from "../../constants/scoring"

// Simple Selectors
export const profileSelecotor = state => state.profile || {}
export const isAuthorizedSelector = state => profileSelecotor(state).authorized
export const isSignUpSelector = state => profileSelecotor(state).isSignUp
export const roleSelector = state => profileSelecotor(state).role
export const potentialRoleSelector = state => profileSelecotor(state).potentialRole
export const scoringStatusSelector = state => profileSelecotor(state).scoringStatus
export const profileLoadingSelector = state => profileSelecotor(state).loading
export const avatarSelector = state => profileSelecotor(state).avatar
export const deletionRequestedSelector = state => profileSelecotor(state).deletionRequested
export const profileAvatarSelector = state => profileSelecotor(state).avatar
export const carsListSelector = state => profileSelecotor(state).carsList
export const isHostSelector = state => roleSelector(state) === ROLE.HOST
export const isGuestSelector = state => roleSelector(state) === ROLE.GUEST
export const isHostFinishedRegistrationSelector = state => profileSelecotor(state).isHostFinishedRegistration

// Complex Selector
export const isNotPassedSelector = state => {
	const scoringStatus = scoringStatusSelector(state)

	return scoringStatus === SCORING_STATUS.NOT_PASSED
}
export const isRejectedSelector = state => {
	const scoringStatus = scoringStatusSelector(state)

	return scoringStatus === SCORING_STATUS.REJECTED
}
export const isInProgressSelector = state => {
	const scoringStatus = scoringStatusSelector(state)

	return [
		SCORING_STATUS.IN_PROGRESS,
		SCORING_STATUS.MANUAL,
		SCORING_STATUS.FAILED
	].includes(scoringStatus)
}
export const profileUserDataSelector = state => {
	const profile = profileSelecotor(state)

	return {
		firstName: profile.firstName,
		lastName: profile.lastName,
		midName: profile.midName,
		birthDate: profile.birthDate
	}
}
export const isBannedSelector = state => {
	const { isBanned } = profileSelecotor(state)
	const role = roleSelector(state)
	const isRejected = isRejectedSelector(state)
	const isNotPassed = isNotPassedSelector(state)

	return (isRejected && isBanned) || (role === ROLE.OBSERVER && !isNotPassed)
}
export const isHostCarAddedSelector = state => {
	const carsList = carsListSelector(state)

	return !carsList.error && carsList.length !== 0
}