import ObserverModal from './ObserverModal'
import SuccessRegistrationModal from './SuccessRegistrationModal'
import NeedDocumentsModal from './NeedDocumentsModal'
import SuperUserModal from './SuperUserModal'
import KbmInfoModal from './KbmInfoModal'
import PaymentCardModal from './PaymentCardModal'
import DetachPaymentCardModal from './DetachPaymentCardModal'
import SendDocumentsModal from './SendDocumentsModal'
import SupportWillContactModal from './SupportWillContactModal'
import popupFactory from './popupFactory'
import SearchModal from './SearchModal'

export const MODAL_KEY = {
	NEED_DOCUMENTS_MODAL: 'need-docs-modal'
}

export const requestSearchModal = popupFactory.create(SearchModal).open
export const requestObserverModal = popupFactory.create(ObserverModal).open
export const requestSuccessRegistrationModal = popupFactory.create(SuccessRegistrationModal).open
export const requestNeedDocumentsModal = popupFactory.create(
	NeedDocumentsModal,
	MODAL_KEY.NEED_DOCUMENTS_MODAL,
).open
export const requestSuperUserModal = popupFactory.create(SuperUserModal).open
export const requestKbmInfoModal = popupFactory.create(KbmInfoModal).open
export const requestDetachPaymentCardModal = popupFactory.create(DetachPaymentCardModal).open
export const requestPaymentCardModal = popupFactory.create(PaymentCardModal).open
export const requestSupportWillContactModal = popupFactory.create(SupportWillContactModal).open
export const requestSendDocumentsModal = popupFactory.create(SendDocumentsModal).open
