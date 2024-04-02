import { StyleSheet, Dimensions, Platform } from "react-native";

export const deviceHeight = Dimensions.get("window").height;
export const deviceWidth = Dimensions.get("window").width;


export default (CommonStyles = StyleSheet.create({
    safeAreaView: {
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff"
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.BorderColor,
        borderRadius: 50,
        width: deviceWidth - 80,
        height: 45,
        fontFamily: Fonts.JosefinSansRegular,
        marginBottom: 10,
        textAlign: "center",
        backgroundColor: Colors.SecondaryColor
    }
}));