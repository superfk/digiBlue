import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ActionSheetIOS
} from 'react-native';

import PropTypes from 'prop-types';

import { Container, Button, ListItem, Text, Icon, Left, Body, Right, Input, Item } from 'native-base';
import { Picker } from '@react-native-community/picker';
import { useTranslation } from 'react-i18next';


const InfoScreen = props => {

    const { t, i18n } = useTranslation('infoPage');
    const [langLabel, setLangLabel] = useState('English');

    const lang = [
        { key: 'en', label: 'English', value: 'en', idx: 0 },
        { key: 'zh_tw', label: '繁體中文', value: 'zh_tw', idx: 1 },
        { key: 'zh_cn', label: '简体中文', value: 'zh_cn', idx: 2 },
    ]

    const langItems = lang.map(elm => {
        return <Picker.Item key={elm.key} label={elm.label} value={elm.value} />
    })

    const onPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: lang.map(elm => {
                    return elm.label;
                })
            },
            buttonIndex => {
                const sleValue = lang.find(elm => elm.idx === buttonIndex);
                if (sleValue !== undefined) {
                    setLangLabel(sleValue.label);
                    props.langChanged(sleValue.value)
                }
            }
        );
    useEffect(() => {
        const sleValue = lang.find(elm => elm.value === props.curLang);
        if (sleValue !== undefined) {
            setLangLabel(sleValue.label);
        }
    }, [props.curLang])

    const PickerSwitch = () => {
        if (Platform.OS === 'ios') {
            return <Button transparent onPress={onPress}>
                <Text style={{ fontSize: 16 }}>{langLabel}</Text>
            </Button>
        } else {
            return <Picker
                prompt={t('infoPage:setichLangTitle')}
                selectedValue={props.curLang}
                style={{ height: 50, width: 150 }}
                onValueChange={async (value, index) => { props.langChanged(value); }}>
                {
                    lang.map(elm => {
                        return <Picker.Item key={elm.key} label={elm.label} value={elm.value} />
                    })
                }
            </Picker>
        }
    }

    return (
        <Container>
            <ListItem icon >
                <Left>
                    <Icon active type="FontAwesome5" style={{ fontSize: 20, color: 'blue' }} name="globe" />
                </Left>
                <Body>
                    <Text>{t('infoPage:language')}</Text>
                </Body>
                <Right >
                    <PickerSwitch />
                </Right>
            </ListItem>
            <ListItem>
                <Body>
                    <Text>{t('infoPage:appVer')}</Text>
                </Body>
                <Right>
                    <Text>0.1.0</Text>
                </Right>
            </ListItem>
            <ListItem>
                <Body>
                    <Text>engineer mode</Text>
                </Body>
                <Right>
                    <Item>
                        <Input
                            style={styles.input}
                            onChangeText={props.handleEngMode} /></Item>
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
    input: {
        width: 100,
        maxHeight: 30,
        borderBottomWidth: 1,
        backgroundColor: "#f1f1f1",
        padding: 0,
        fontSize: 16
    }
});

export default InfoScreen;
