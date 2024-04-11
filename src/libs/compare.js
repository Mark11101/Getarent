// Equality Fn
export const selectOnce = () => true

export const compareValues = (left, right) => JSON.stringify(left) === JSON.stringify(right)

export const compareProps = (...fields) => (left, right) => {
	if (!left || !right || !fields.length) return compareValues(left, right)

	return fields.length === fields.reduce(
		(acc, field) => compareValues(left[field], right[field])
			? acc + 1 : acc
	, 0)
}

export const compareArrayProps = (...fields) => (left, right) => {
	if (!left || !right) return compareValues(left, right)
	if (left.length === right.length) return left.reduce((acc, item, idx) => {
		if (compareProps(...fields)(item, right[idx])) return acc + 1
		return acc
	}, 0) === left.length
	return false
}

export const ignoreProps = (...fields) => (left, right) => {
	const filteredFields = Object.keys({ ...left, ...right }).filter(key => !fields.includes(key))
	return compareProps(...filteredFields)(left, right)
}

const compare = {
	once: selectOnce,
	values: compareValues,
	props: compareProps,
	arrays: compareArrayProps,
	ignoringProps: ignoreProps
}

export default compare
