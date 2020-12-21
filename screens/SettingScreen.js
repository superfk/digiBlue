import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Dimensions,
    Platform,
    ActionSheetIOS
} from 'react-native';
import PropTypes from 'prop-types';

import { Container, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import { Picker } from '@react-native-community/picker';
import { useTranslation } from 'react-i18next';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const options = [
    { hr: "0", idx: 0, key: "0.5", min: "30" },
    { hr: "1", idx: 1, key: "1.0", min: "00" },
    { hr: "1", idx: 2, key: "1.5", min: "30" },
    { hr: "2", idx: 3, key: "2.0", min: "00" },
    { hr: "2", idx: 4, key: "2.5", min: "30" },
    { hr: "3", idx: 5, key: "3.0", min: "00" },
    { hr: "3", idx: 6, key: "3.5", min: "30" },
    { hr: "4", idx: 7, key: "4.0", min: "00" },
    { hr: "4", idx: 8, key: "4.5", min: "30" },
    { hr: "5", idx: 9, key: "5.0", min: "00" },
    { hr: "5", idx: 10, key: "5.5", min: "30" },
    { hr: "6", idx: 11, key: "6.0", min: "00" },
    { hr: "6", idx: 12, key: "6.5", min: "30" },
    { hr: "7", idx: 13, key: "7.0", min: "00" },
    { hr: "7", idx: 14, key: "7.5", min: "30" },
    { hr: "8", idx: 15, key: "8.0", min: "00" }
]


const SettingScreen = props => {

    const { t, i18n } = useTranslation('setPage');

    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabledTurnOn, setIsEnabledTurnOn] = useState(props.status.machineTurnOn);
    const [timeValue, setTimeValue] = useState(props.status.curOperateTimeHour);
    const [timeLabelIndex, setTimeLabelIndex] = useState(0);
    const [disableTurnOn, setdisableTurnOn] = useState(true);
    const [disableActivation, setdisableActivation] = useState(true);

    const handleActivateMachine = () => {
        props.handleActivateMachine();
    };
    const handleSetRunTime = () => {
        props.handleSetRunTime(timeValue);
        setIsEnabled(!isEnabled)
    };
    const toggleSwitchTurnOn = () => {
        console.log('pressed turon on')
        props.handleTurnOnMachine(!isEnabledTurnOn);
        setIsEnabledTurnOn(!isEnabledTurnOn)
    };
    const timeItems = () => {
        const intv = 0.5;
        const maxH = 8;
        let items = [];
        for (let i = 0; i < maxH / intv; i++) {
            const curTime = (i + 1) * intv;
            const hr = Math.trunc(curTime)
            var min = (curTime + "").split(".")[1] === undefined ? '00' : '30';
            // const item = { key: curTime.toFixed(1), label: `${hr} H ${min} M`, value: curTime.toFixed(1) }
            // const item = { key: curTime.toFixed(1), label: `${hr} H ${min} M`, value: i }
            const item = <Picker.Item key={curTime.toFixed(1)} label={`${hr} ${t('setPage:hour')} ${min} ${t('setPage:min')}`} value={curTime.toFixed(1)} />
            items.push(item)
        }
        return items;
    }

    const data = options.map(elm => {
        return { ...elm, label: `${elm.hr} ${t('setPage:hour')} ${elm.min} ${t('setPage:min')}` };
    });


    const handleTimeChange = (itemValue, itemIndex) => {
        setTimeValue(itemValue);
        setTimeLabelIndex(itemIndex);
    }

    useEffect(() => {
        if (props.status.machineConnStatus === 2) {
            setdisableTurnOn(false);
        } else {
            setdisableTurnOn(true);
        }
    }, [props.status.machineConnStatus])

    useEffect(() => {
        setIsEnabledTurnOn(props.status.machineTurnOn);
        if (props.status.machineTurnOn) {
            setdisableActivation(true)
        } else {
            setdisableActivation(false);
        }
    }, [props.status.machineTurnOn])

    useEffect(() => {
        setIsEnabled(props.status.machineActivated);
    }, [props.status.machineActivated])

    useEffect(() => {
        setTimeValue(props.status.curOperateTimeHour);
        const sleValue = data.find(elm => elm.key === props.status.curOperateTimeHour);
        if (sleValue !== undefined) {
            setTimeLabelIndex(sleValue.idx);
        }
    }, [props.status.curOperateTimeHour])


    const onPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: data.map(elm => {
                    return elm.label;
                })
            },
            buttonIndex => {
                const sleValue = data.find(elm => elm.idx === buttonIndex);
                if (sleValue !== undefined) {
                    handleTimeChange(sleValue.key, buttonIndex);
                }
            }
        );

    const PickerSwitch = () => {
        if (Platform.OS === 'ios') {
            return <Button transparent small onPress={onPress} disabled={disableActivation} >
                <Text style={{ fontSize: 16 }}>{data[timeLabelIndex].label}</Text>
            </Button>
        } else {
            return <Picker
                prompt={t('setPage:runtime')}
                selectedValue={timeValue}
                style={{ height: 50, width: 150 }}
                onValueChange={handleTimeChange}>
                {timeItems()}
            </Picker>
        }
    }

    return (
        <Container>
            <ListItem icon style={styles.listItem}>
                <Left>
                    <Icon active type="FontAwesome5" style={{ fontSize: 20, color: 'green' }} name="history" />
                </Left>
                <Body>
                    <Text style={styles.title}>{t('setPage:runtime')}</Text>
                </Body>
                <Right>
                    <PickerSwitch />
                </Right>
            </ListItem>
            <ListItem icon >
                <Left>
                    <Icon active type="MaterialCommunityIcons" style={{ fontSize: 20, color: 'blue' }} name="checkbox-marked-circle-outline" />
                </Left>
                <Body>
                    <Text style={styles.title}>{t('setPage:setTime')}</Text>
                </Body>
                <Right >
                    <Button success small onPress={handleSetRunTime} disabled={disableActivation} >
                        <Text style={{ fontSize: 16, color: 'white' }} >{t('setPage:set')}</Text>
                    </Button>
                </Right>
            </ListItem>
            <ListItem icon >
                <Left>
                    <Icon active type="FontAwesome5" style={{ fontSize: 20, color: 'blue' }} name="sync-alt" />
                </Left>
                <Body>
                    <Text style={styles.title}>{t('setPage:activation')}</Text>
                </Body>
                <Right >
                    <Button success small onPress={handleActivateMachine} disabled={disableActivation} >
                        <Text style={{ fontSize: 16, color: 'white' }} >{t('setPage:start')}</Text>
                    </Button>
                </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                    <Icon active type="FontAwesome5" style={{ fontSize: 20, color: 'red' }} name="power-off" />
                </Left>
                <Body>
                    <Text style={styles.title}>{t('setPage:turnOnOff')}</Text>
                </Body>
                <Right>
                    <Switch value={isEnabledTurnOn} onValueChange={toggleSwitchTurnOn} disabled={disableTurnOn} />
                </Right>
            </ListItem>

        </Container>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    button: {
        marginBottom: 10
    },
    switch: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: windowWidth < 400 ? 12 : 18
    },
    listItem: {
    }
});

export default SettingScreen;
