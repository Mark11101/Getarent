import React, { useRef, useCallback } from 'react';
import { ScrollView, Platform } from 'react-native';

/**
 * ScrollView с добавлением хука который учитывает изменяемый размер скрина
 */
const ScrollViewChangeContent = ({ scrollViewRef, ...props }) => {
	
	const scrollViewProps = useScrollViewProps(scrollViewRef);

	return (
		<ScrollView
			ref={scrollViewRef}
			keyboardShouldPersistTaps="handled"
			{...scrollViewProps}
			{...props}
		/>
	);
};

export default React.memo(ScrollViewChangeContent);

const useScrollViewProps = (scrollViewRef) => {

	const defaultRef = useRef();
	const heightRef = useRef(0);
	
	const ref = scrollViewRef || defaultRef;
	
	const onLayout = useCallback(e => {
		heightRef.current = e.nativeEvent.layout.height;
	}, []);

	const onContentSizeChange = useCallback(
		(_, height) =>
			heightRef.current >= height &&
			ref.current?.scrollTo({ y: 0, animated: false }),
		[ref]
	);

	if (Platform.OS !== 'ios') {
		return null;
	}

	return {
		ref,
		onLayout,
		onContentSizeChange,
		alwaysBounceVertical: false,
	};
};
