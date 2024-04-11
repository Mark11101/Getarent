import React from 'react'
import { useFocusEffect } from "@react-navigation/native"

class Refs {
	constructor() {
		this._elements = new Map()
	}

	setRef = keyOrRef => {
		if (typeof keyOrRef !== 'string') {
			this._elements.set('scroll', keyOrRef)
		} else {
			return ref => {
				if (ref) this._elements.set(keyOrRef, ref)
			}
		}
	}

	getRef(key) {
		return this._elements.get(key)
	}

	remove(key) {
		this._elements.delete(key)
	}

	clear() {
		this._elements.clear()
	}
}

export const useScrollToOnFocus = key => {
	const [ refs ] = React.useState(new Refs())

	useFocusEffect(React.useCallback(() => {
		const scroll = refs.getRef('scroll')
		const target = refs.getRef(key)

		if (scroll?.scrollTo && target?.measure) {
			target.measure((x, y) => {
				scroll.scrollTo({ x, y, animated: true })
			})
		}
	}, [ refs, key ]))

	React.useEffect(() => {
		return  () => {
			refs.clear()
		}
	}, [])

	return refs.setRef
}
