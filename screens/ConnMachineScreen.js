import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet, Text,
    Dimensions,
} from 'react-native';
import { Icon, Spinner, Input, Item } from 'native-base';

import PropTypes from 'prop-types';

import Card from '../components/Card';
import MainButton from '../components/MainButton.ios';
import { useTranslation } from 'react-i18next';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ConnMachineScreen = props => {

    const { t, i18n } = useTranslation('connPage');
    const [deviceKeyinValue, setDeviceKeyinValue] = useState('demo-04');
    const [showDeviceKeyin, setShowDeviceKeyin] = useState(false);

    const handleDeviceKeyin = () => {
        setShowDeviceKeyin(true);
    }
    const handleDeviceKeyinSubmit = () => {
        console.log(deviceKeyinValue)
        setShowDeviceKeyin(false)
        props.resultHandler(deviceKeyinValue)
    }

    return (
        <View style={styles.screen}>
            <View style={styles.screen}>
                <Card style={styles.connectActionButonsContainer}>
                    <MainButton
                        color={{ backgroundColor: '#00b894' }}
                        onPress={props.showBarcode}
                        icon={<Icon style={styles.icon}
                            type="FontAwesome5"
                            name="barcode" />} >
                        {t('connPage:barcodeScan')}
                    </MainButton>
                    <MainButton
                        color={{ backgroundColor: '#6c5ce7' }}
                        onPress={handleDeviceKeyin}
                        icon={<Icon style={styles.icon}
                            type="FontAwesome5"
                            name="keyboard" />} >
                        {t('connPage:inputScan')}
                    </MainButton>
                    {showDeviceKeyin ? <Item style={{ marginVertical: 5 }}>
                        <Input
                            onChangeText={text => setDeviceKeyinValue(text)}
                            onSubmitEditing={handleDeviceKeyinSubmit}
                            value={deviceKeyinValue} />
                    </Item> : null}
                    <MainButton
                        color={{ backgroundColor: 'red' }}
                        onPress={props.handleDeviceDisconnect} disabled={props.status.machineConnStatus !== 2}>
                        {t('connPage:disconnect')}
                    </MainButton>
                </Card>
                <Card style={styles.connectStatusContainer}>
                    <Text style={{ color: '#636e72', fontSize: 12 }}>{t('connPage:title')}</Text>
                    <Text style={styles.deviceID}>{props.deviceName}</Text>
                    <Text style={styles.connStatus}>{props.status.machineConnStatus === 2 ? t('connPage:devConnOK') : props.status.machineConnStatus === 1 ? <Spinner /> : "--"}</Text>
                </Card>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        overflow: 'scroll'
    },
    button: {
        marginBottom: 10
    },
    icon: {
        marginRight: 10,
        color: 'white'
    },
    disconnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    connectActionButonsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: windowHeight > 600 ? 20 : 5,
        width: 400,
        maxWidth: '90%',
        minHeight: windowHeight > 600 ? 180 : 100,
    },
    connectStatusContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: windowHeight > 600 ? 20 : 5,
        width: 400,
        maxWidth: '90%',
        minHeight: windowHeight > 600 ? 250 : 150,
    },
    connStatus: {
        fontSize: windowHeight > 600 ? 28 : 18,
        color: '#636e72',
        height: windowHeight > 600 ? 30 : 20,
    },
    deviceID: {
        fontSize: windowHeight > 600 ? 40 : 20,
        color: '#2d3436',
        textAlign: 'center'
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    turnONText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#636e72',
        marginRight: 5
    }
});

export default ConnMachineScreen;
