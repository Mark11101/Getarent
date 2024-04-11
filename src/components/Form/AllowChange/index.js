import React from 'react'

export const AllowChange = ({
	children,
	selectValue = e => e.nativeEvent.text,
	methodName = 'onChange',
	regExp
}) => {
	return <>
		{
			React.Children.map(children, child => {
				if (React.isValidElement(child)) return React.cloneElement(child, {
					...child.props,
					[methodName]: e => {
						if (!(regExp instanceof RegExp)) {
							child.props?.[methodName]?.(e)
							return
						}

						const value = selectValue(e)
						if (!regExp.test(value)) return

						child.props?.[methodName]?.(e)
					}
				})
			})
		}
	</>
}
