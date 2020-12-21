import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,Dimensions} from 'react-native';

import Colors from '../constants/colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const MainButton = props => {

  const buttonStyle = props.disabled ? { 
    ...styles.button, 
    ...props.color,
    ...styles.buttonDisabled
    } : { 
    ...styles.button, 
    ...props.color,
    }
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={props.onPress}>
      <View style={buttonStyle} pointerEvents={props.disabled ? 'none' : "auto"}>
        {props.icon}
        <Text style={styles.buttonText}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: windowHeight > 600 ? 40 : 20,
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: 'white',
    fontSize: windowHeight > 600 ? 24 : 16,
  }
});

export default MainButton;
