import {
    Alert,
    ToastAndroid, Platform

} from "react-native";
export default showAlertMessage = (type,msg) => {
    Platform.OS == 'android' ?
        ToastAndroid.showWithGravityAndOffset(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        ) :
        setTimeout(function () {
            Alert.alert(
                `${type}!!`,
                msg,
                [{ text: 'OK', onPress: () => console.log("OK") }],
                { cancelable: false }
            );
        }, 500);
};