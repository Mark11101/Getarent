## cli build

export JAVA_HOME="/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home"

cd android
./gradlew assembleRelease

cd android
./gradlew bundleRelease

cd android
./gradlew clean

## icons

для иконок мы используем react-native-vector-icons, иконочный шрифт мы генерируем с помощью сервиса https://icomoon.io/app/#/select

Чтобы добавить туда иконку мы экспортируем из фигмы иконку в формате svg, берём файл selection.json, драг-н-дропем этот файл (восстанавливаем проект в icomoon), драг-н-дропаем svg, средствами icomoon убираем из иконки цвет, центрируем её, растягиваем до краёв.
Потом заново генерим шрифт, если в превью новая иконка кривая - материмся, просим @Denyaglav поправить в фигме, повторяем операцию. Генерим шрифт, заменяем selection.json в components/Icon, кидаем шрифт в fonts и в assets у андройда

## run-android Errors

./sdkmanager --licenses
Exception in thread "main" java.lang.NoClassDefFoundError:

https://stackoverflow.com/questions/53076422/getting-android-sdkmanager-to-run-with-java-11