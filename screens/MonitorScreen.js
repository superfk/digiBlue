import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet, Text,
    Dimensions,
    ScrollView, Image
} from 'react-native';

import PropTypes from 'prop-types';

import { Badge } from 'native-base';

import Card from '../components/Card';
import FlowProgressBar from '../components/FlowProgressBar';
import TemperatureProgressBar from '../components/TemperatureProgressBar';
import { useTranslation } from 'react-i18next';

const windowWidth = Dimensions.get('window').width;

const MonitorScreen = props => {

    const { t, i18n } = useTranslation('monPage');

    const [percentFlow, setPercentFlow] = useState('--');
    const [percentTemp, setPercentTemp] = useState('--');
    const [totOpTime, setTotOpTime] = useState('--');
    const [hms, setHms] = useState('--:--:--');


    const progressWidth = windowWidth < 400 ? 100 : 150;
    const { lowFlow, highFlow, lowTemp, highTemp } = props.limits;

    useEffect(() => {
        setTotOpTime(props.status.totalOperateTime);
        if (props.status.machineConnStatus === 2) {
            let percFlow = (props.status.flowRate - lowFlow) / (highFlow - lowFlow);
            percFlow = percFlow < 0 ? 0.0
                : percFlow > 1 ? 1
                    :
                    isNaN(percFlow) ? '--' : percFlow;

            let percTemp = (props.status.temperature - lowTemp) / (highTemp - lowTemp);
            percTemp = percTemp < 0 ? 0.0
                : percTemp > 1 ? 1
                    :
                    isNaN(percTemp) ? '--' : percTemp;

            const remTimeSec = parseInt(parseFloat(props.status.operatedRemaingTimeHour) * 60 * 60);
            const remTime = new Date(remTimeSec * 1000).toISOString().substr(11, 8);

            setPercentFlow(percFlow);
            setPercentTemp(percTemp);
            setTotOpTime(props.status.totalOperateTime);
            setHms(remTime);
        } else {
            setPercentFlow('--');
            setPercentTemp('--');
            setTotOpTime('--');
            setHms('--:--:--');
        }

    }, [props.status])

    return (
        <ScrollView>
            <View style={styles.screen}>
                <Image style={styles.tinyLogo} source={require('../assets/UHC500NB.png')} />
                <Card style={styles.deviceModel}>
                    {
                        props.status.machineConnStatus !== 2 ? <Text adjustsFontSizeToFit={true}>{t('monPage:devStatusNG')}</Text> :
                            <Text style={styles.modelName} adjustsFontSizeToFit={true} numberOfLines={1}>{props.deviceName}</Text>
                    }
                </Card>
                <View style={styles.list}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listHeaderText}>{t('monPage:title')}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:hydFlow')}</Text>
                        </View>
                        <View>
                            {props.mode === 'eng' ? <Text>{props.status.flowRate} c.c./min</Text> : <FlowProgressBar style={styles.listItemValue} fullWidth={progressWidth} value={percentFlow} />}
                            {/* <Text style={styles.listItemValue}>{props.status.flowRate + ' cc/min'}</Text> */}
                        </View>
                    </View>
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:devTemp')}</Text>
                        </View>
                        <View>
                            {props.mode === 'eng' ? <Text>{props.status.temperature} °C</Text> : <TemperatureProgressBar style={styles.listItemValue} fullWidth={progressWidth} value={percentTemp} />}
                            {/* <Text style={styles.listItemValue}>{props.status.temperature + ' °C'}</Text> */}
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:waterLevel')}</Text>
                        </View>
                        <View>
                            {
                                props.status.machineConnStatus !== 2 ? <Text>--</Text> :
                                    <Badge style={props.status.waterLevelOK ? styles.listItemStatusOK : styles.listItemStatusNG}>
                                        <Text style={styles.listItemStatusText}>{props.status.waterLevelOK ? 'OK' : 'NG'}</Text>
                                    </Badge>
                            }
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:pipeline')}</Text>
                        </View>
                        <View>
                            {
                                props.status.machineConnStatus !== 2 ? <Text>--</Text> :
                                    <Badge style={props.status.pressureOK ? styles.listItemStatusOK : styles.listItemStatusNG}>
                                        <Text style={styles.listItemStatusText}>{props.status.pressureOK ? 'OK' : 'NG'}</Text>
                                    </Badge>
                            }
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:filter')}</Text>
                        </View>
                        <View>
                            {
                                props.status.machineConnStatus !== 2 ? <Text>--</Text> :

                                    <Badge style={props.status.filterOK ? styles.listItemStatusOK : styles.listItemStatusNG}>
                                        <Text style={styles.listItemStatusText}>{props.status.filterOK ? 'OK' : 'NG'}</Text>
                                    </Badge>
                            }
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:totalUseHour')}</Text>
                        </View>
                        <View>
                            {
                                props.status.machineConnStatus !== 2 ? <Text style={styles.listItemValue}>{'--'}</Text> :
                                    <Text style={styles.listItemValue}>{totOpTime + t('monPage:hour')}</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.listItemTitle}>{t('monPage:remainHour')}</Text>
                        </View>
                        <View>
                            {
                                props.status.machineConnStatus !== 2 ? <Text style={styles.listItemValue}>{'--'}</Text> :
                                    <Text style={styles.listItemValue}>{hms}</Text>
                            }

                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    tinyLogo: {
        maxWidth: 80,
        maxHeight: 80,
    },
    deviceModel: {
        width: '80%',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: 'white',
        zIndex: 10,
    },
    modelName: {
        fontWeight: 'bold',
        fontSize: 24
    },
    list: {
        position: 'relative',
        top: -40,
        width: '100%',
        margin: 0,
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingTop: 40
    },
    listHeader: {
        alignItems: 'center',
        borderColor: '#ccc',
        borderBottomWidth: 2,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    listHeaderText: {
        fontSize: 20
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#ccc',
        borderBottomWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        maxHeight: 70
    },
    listItemTitle: {
        fontSize: windowWidth < 400 ? 16 : 20,
        color: '#636e72'
    },
    listItemValue: {
        fontSize: windowWidth < 400 ? 16 : 20,
        color: '#0984e3',
        maxWidth: windowWidth < 400 ? 100 : 150,
    },
    listItemStatusOK: { height: 40, width: 60, alignItems: 'center', backgroundColor: '#00b894' },
    listItemStatusNG: { height: 40, width: 60, alignItems: 'center', backgroundColor: '#d63031' },
    listItemStatusText: { fontSize: 20, color: 'white' },
});

export default MonitorScreen;
