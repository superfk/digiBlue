import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const TemperatureProgressBar = props => {
    const progValue = props.value === '--' ? 0 : parseFloat(props.value);
    const arrowWidth = 15;
    const width = parseInt(props.fullWidth * progValue - arrowWidth / 2);
    return (
        <View style={{ ...styles.barContainer, ...props.style }}>
            <View style={styles.bar1}>
                <View style={{ width: width }}></View>
                <Image style={{ maxWidth: arrowWidth, maxHeight: 10 }} source={require('../assets/arrow.png')} />
            </View>
            <View style={styles.bar2}>
                <Image style={{ maxWidth: props.fullWidth}} resizeMode={'contain'} source={require('../assets/tempbar.png')} />
            </View>
            {/* <Progress.Bar progress={0.5} width={null} borderWidth={1} color='rgba(62, 185, 234, 1)' /> */}
            <View style={styles.bar3}>
                <Text style={{fontSize: 10 }} >L</Text>
                <Text style={{ fontSize: 10 }} >H</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    barContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
    },
    bar1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    bar2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    bar3: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: '100%',
        marginTop: 3
    },
    tinyLogo: {
        maxWidth: 30,
        maxHeight: 20
    },
});

export default TemperatureProgressBar;
