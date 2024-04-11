import { Platform } from "react-native";

export default (photo) => ({
    uri: Platform.OS === 'ios' ? `file://${photo.path}` : photo.path,
    name: photo.filename ?? 'photo',
    type: photo.mime,
});
