import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

// Icon.loadFont().catch((error) => { console.info(error); });

export default Icon;
