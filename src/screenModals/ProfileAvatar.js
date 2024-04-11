import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import {
	Waiter,
	AvatarLoader,
	PrimaryButton,
	ModalizedScreen
} from '../components'
import { Formik } from 'formik'
import actions from '../actions'
import { showLoadPhotoError } from '../functions'
import theme from '../theme'

const initialValues = { avatar: '' }

export const ProfileAvatarModal = ({ navigation, route: { params: { avatar } = {} } }) => {
	const dispatch = useDispatch()

	const [ waiter, setWaiter ] = useState(false)
	const [ uploadedAvatar, setAvatar ] = useState(null)

	const onSubmit = useCallback(() => {
		navigation.goBack()
	}, [])

	const addAvatar = useCallback(() => async (event) => {
		try {
			setWaiter(true)
			const res = await event;

			if (res.avatar) {
				setAvatar(res.avatar)
				dispatch(actions.profileRequest())
			}

			setWaiter(false)
		} catch (err) {
			showLoadPhotoError(err.message)
			setWaiter(false)
		} finally {
			setWaiter(false)
		}
	}, [ setWaiter, dispatch ])

	return <ModalizedScreen
		onBack={() => navigation.goBack()}
		title="Сменить фото профиля"
	>
		<Formik {...{ initialValues, onSubmit }}>
			{({ handleSubmit }) => waiter ?<Waiter /> : <>
					<View style={styles.contentCenter}>
						<AvatarLoader
							avatar={uploadedAvatar || avatar}
							diameter={188}
							isPublic
							name="avatar"
							text="Выбрать другое"
							key="avatar"
							onSelect={addAvatar()}
						/>
					</View>
					<PrimaryButton
						style={theme.styles.primaryBtn}
						title="Сохранить"
						onPress={handleSubmit}
					/>
				</>
			}
		</Formik>
	</ModalizedScreen>
}

const styles = StyleSheet.create({
	contentCenter: {
		...theme.styles.container,
		justifyContent: 'center',
		alignItems: 'center'
	}
})
