import { useEffect } from 'react';
import { BackHandler } from 'react-native';

// neither beforeRemove not blur event seems to work correctly

const usePreventBack = () => {

	useEffect(() => {
	
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
	
		return () => backHandler.remove();

	  }, []);
}

export default usePreventBack;
