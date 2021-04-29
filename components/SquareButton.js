import React from "react";
import { View, StyleSheet } from "react-native";
import {Text, Button } from "native-base";

const CardItemButton = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>
      <Button transparent light>
        <Text style={styles.text}>{props.text}</Text>
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.26,
    elevation: 4,
    backgroundColor: "#F2F2F2",
    padding: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  text: {
    fontSize: 14,
    color: 'black'
  },
});

export default CardItemButton;
