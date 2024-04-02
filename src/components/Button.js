import React, { Component } from "react";
import { View, TouchableOpacity, Dimensions, Image, Text } from "react-native";
import reactCSS from "reactcss";
export const deviceWidth = Dimensions.get("window").width;

import { Fonts } from "../../utils/fonts";

const SQUARE_RADIUS = 0;
const ROUNDED_RADIUS = 50;
const HEIGHT = 45;
const NOOP = () => {};

export const AppButton = ({
  text,
  onPress,
  disabled,
  rounded,
  full,
  style,
  isIcon,
  backColor,
  textColor,
  isBackColor
}) => {
  const styles = reactCSS({
    default: {
      button: {
        width: full ? deviceWidth : deviceWidth - 80,
        display: "flex",
        alignItems: "center",
        height: HEIGHT,
        borderWidth: 0,
        backgroundColor: backColor,
        ...style
      },
      textStyle: {
        color: textColor,
        textAlign: "center",
        fontFamily: Fonts.JosefinSansRegular,
        fontSize: isIcon ? 10 : 16,
        lineHeight: 35
      }
    }
  });

  return (
    <TouchableOpacity
      colors={
        isBackColor ? ["#73d1b7", "#abe3d3"] : ["transparent", "transparent"]
      }
      style={[
        styles.button,
        {
          justifyContent: "center",
          borderRadius: rounded ? ROUNDED_RADIUS : SQUARE_RADIUS
        }
      ]}
      onPress={disabled ? NOOP : onPress}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
