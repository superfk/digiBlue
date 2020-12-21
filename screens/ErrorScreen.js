import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import Card from '../components/Card';

const windowWidth = Dimensions.get('window').width;

const ErrorScreen = props => {

    const { t, i18n } = useTranslation('errPage');

    const [errorTitle, setErrorTitle] = useState('');
    const [errorText, setErrorText] = useState('');
    // let errCode = 'M0';
    //     if (!this.state.machineStatus.pressureOK) {
    //       errCode = 'M10';
    //     }
    //     if (!this.state.machineStatus.waterLevelOK) {
    //       errCode = 'M11';
    //     }
    //     if (!this.state.machineStatus.filterOK) {
    //       errCode = 'M20';
    //     }
    //     if (this.state.machineStatus.temperature > this.state.limits.highTemp) {
    //       errCode = 'M14';
    //     }
    //     switch (this.state.machineStatus.errorStopCode) {
    //       case 5:
    //         errCode = 'M17';
    //         break;
    //       case 6:
    //         errCode = 'M16';
    //         break;
    //       case 9:
    //         errCode = 'M19';
    //         break;
    //       default:

    //     }

    
    // code0Title: '無異常',
    // code0Detail: '目前機器狀況一切正常，若有任何異常狀況，將會顯示於此。',
    // code1Title: '氣阻',
    // code1Detail: '1. 當機器內部壓力偵測超過設定值，氣阻警示燈將亮起，機器將自動停止。2. 請檢查出氫管線是否暢通，是否有不正常折彎或是異物阻塞。3. 將異常狀況解除後，請按下重設鍵，系統將回至待機模式。',
    // code2Title: '缺水',
    // code2Detail: '1. 若氫氣機水箱內的水量低於最低液面位置，補水警示燈會亮起，機器會自動停止。2. 請緩緩添加純淨水至水箱內，直至補水警示燈熄滅並發出2聲嗶聲，系統將回到待機狀態。',
    // code3Title: '濾心更換警示',
    // code3Detail: '1. 系統內建半年更換濾心提醒，當更換濾心警示燈亮起時，請按照說明書上「濾心更換步驟」更換專用濾心。2. 更換濾心後，請按下重設鍵5秒，系統將重新計算半年時間。',
    // code4Title: '過溫',
    // code4Detail: '1. 當機器內部環境溫度超過設定值，過溫警示燈將亮起，機器將自動停止但降溫風扇持續轉動，直至機器內部環境溫度降至設定值以下，過溫警示燈將自動熄滅。2.	當過溫警示燈自動熄滅後，請按下重設鍵，系統將回至待機模式。',
    useEffect(() => {
        switch (props.errorCode) {
            case 'M10':
                setErrorTitle(t('errPage:code1Title'));
                setErrorText(t('errPage:code1Detail'));
                break;
            case 'M11':
                setErrorTitle(t('errPage:code2Title'));
                setErrorText(t('errPage:code2Detail'));
                break;
            case 'M20':
                setErrorTitle(t('errPage:code3Title'));
                setErrorText(t('errPage:code3Detail'));
                break;
            case 'M14':
                setErrorTitle(t('errPage:code4Title'));
                setErrorText(t('errPage:code4Detail'));
                break;
            default:
                setErrorTitle(t('errPage:code0Title'));
                setErrorText(t('errPage:code0Detail'));
        }
    }, [props.errorCode])

    const hasError = props.errorCode === 'M0';
    const errorCodeStr = hasError ? '' : t('errPage:errorCode') +":" +props.errorCode ;

    return (
        <View style={styles.screen}>
            <View style={styles.errorTopHeader}>
                <Text style={styles.header}>{t('errPage:title')}</Text>
                {hasError ? <Text style={styles.header}>{ errorCodeStr}</Text> : null}
            </View>
            <Card style={styles.errorContainer}>
                <View style={styles.errorHeader}>
                    <Text style={styles.title}>{errorTitle}</Text>
                </View>
                <ScrollView>
                    <View style={styles.errorBody}>
                        <Text style={styles.body}>
                            {errorText}
                        </Text>
                    </View>
                </ScrollView>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    errorContainer: {
        width: '95%',
        shadowOpacity: 0.5,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    errorTopHeader: {
        alignItems: "center",
        width: '100%',
        padding: 5,
    },
    errorHeader: {
        alignItems: "center",
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    header: {
        fontSize: windowWidth < 400 ? 20 : 24,
        color: 'white'
    },
    title: {
        fontSize: windowWidth < 400 ? 16 : 24,
        color: '#2d3436',
    },
    errorBody: {
        flex: 1,
        width: '100%',
        padding: 10,
        overflow: 'scroll',
    },
    body: {
        fontSize: windowWidth < 400 ? 16 : 20,
        color: '#2d3436'
    },
    errorFooter: {
        width: '100%',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    foot: {
        fontSize: windowWidth < 400 ? 12 : 16,
        color: '#0984e3'
    },
});

export default ErrorScreen;
