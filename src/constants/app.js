import { Dimensions, Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

export const VERSION = DeviceInfo.getVersion()
export const WINDOW_WIDTH = Dimensions.get('window').width
export const WINDOW_HEIGHT = Dimensions.get('window').height
export const SCREEN_HAS_NOTCH = DeviceInfo.hasNotch()
export const isAndroid = Platform.OS === 'android'
export const isIos = Platform.OS === 'ios'