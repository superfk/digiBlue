import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Button, Dimensions, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BarcodeScan = props => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        props.handleBarCodeScanned({ type, data });
    };

    return <View
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: windowWidth,
            height: windowHeight,
            zIndex: 1000
        }}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject]}
        />
        {/* <Button style={styles.button} title={'Close Camera'} onPress={() => props.closeScan()} /> */}
        <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={() => props.closeScan()}>
            <View  >
                <Text style={styles.text}>Close Camera</Text>
            </View>
        </TouchableOpacity>
    </View>
};

const styles = StyleSheet.create({
    cameraContainer: {
        marginHorizontal: 0, marginLeft: 0, marginStart: 0,
        paddingHorizontal: 0, paddingLeft: 0, paddingStart: 0,
        height: '100%',
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    button: {
        position: 'absolute',
        left: 0,
        top: windowHeight - 50,
        width: "100%",
        zIndex: 1005,

    },
    text: {
        color: "#6dbde0",
        textAlign: 'center'
    }
});

export default BarcodeScan;
