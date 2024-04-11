import { showLoadPhotoError } from "functions";

export default (onChange) => async request => {
	try {
		const res = await request

		onChange(res);

	} catch (err) {
		console.error(err)
		showLoadPhotoError(err.message)
	}
}
