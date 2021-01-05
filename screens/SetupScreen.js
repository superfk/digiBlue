import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Platform,
    ActionSheetIOS,
    StyleSheet,
    Image
} from 'react-native';
import { Container, Button, Header, Left, Body, Right, Title, Subtitle, Icon } from 'native-base';
import { Picker } from '@react-native-community/picker';

import SystemContext from "../context/sys-context";

const options = [
    { idx: 0, value: "GET(DEV_NAME),DB21", label: "GET(DEV_NAME),DB21" },
    { idx: 1, value: "GET(DEV_SV),563B", label: "GET(DEV_SV),563B" },
    { idx: 2, value: "GET(MS_DURATION),EC15", label: "GET(MS_DURATION),EC15" },
    { idx: 3, value: "GET(MS_METHOD),2C41", label: "GET(MS_METHOD),2C41" },
    { idx: 4, value: "GET(SYSTEM),E9D5", label: "GET(SYSTEM),E9D5" },
    { idx: 5, value: "SET(MS_DURATION=3),889D", label: "SET(MS_DURATION=3),889D" },
]

function SetupScreen({ navigation }) {

    const context = useContext(SystemContext);

    const [command, setCommand] = useState(options[0]);

    const handleCommandChange = (selectedCommand) => {
        setCommand(selectedCommand);
    }

    const onPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: options.map(elm => {
                    return elm.label;
                })
            },
            buttonIndex => {
                const selectedCommand = options.find(elm => elm.idx === buttonIndex);
                if (selectedCommand !== undefined) {
                    handleCommandChange(selectedCommand);
                }
            }
        );

    const pickerSwitch = () => {
        if (Platform.OS === 'ios') {
            return <Button transparent small onPress={onPress}>
                <Text style={{ fontSize: 16 }}>{command.label}</Text>
            </Button>
        } else {
            return <Picker
                prompt={"select command"}
                selectedValue={command.value}
                style={{ height: 50, width: '80%' }}
                onValueChange={async (value, index) => {
                    const selectedCommand = options.find(elm => elm.idx === index);
                    handleCommandChange(selectedCommand);
                }}>
                {options.map(elm => <Picker.Item key={elm.value} label={elm.label} value={elm.value} />)}
            </Picker>
        }
    }

    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.toggleDrawer()}>
                        <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Image style={styles.logo} source={require('../assets/Bareiss_LOGO.png')} />
                    <Subtitle>digiBlue</Subtitle>
                </Body>
                <Right>
                </Right>
            </Header>
            <View style={styles.container}>
                <View style={styles.block} >
                    <Button block primary onPress={context.startScan} style={styles.button}>
                        <Text style={{ color: 'white' }}>Scan</Text>
                    </Button>
                    <Button block warning onPress={context.disconnect}>
                        <Text style={{ color: 'white' }}>Disconnect</Text>
                    </Button>
                </View>
                <View style={styles.block}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1}>Device name: {context.bleDevice ? context.bleDevice.name : '--'}</Text>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1}>Device address: {context.bleDevice ? context.bleDevice.id : '--'}</Text>
                    <View>
                        {pickerSwitch()}
                    </View>
                    <Button block primary onPress={() => { context.handleCommandSend(command) }}>
                        <Text style={{ color: 'white' }}>Send</Text>
                    </Button>
                    <View style={styles.respContainer}>
                        <Text style={styles.valueText} adjustsFontSizeToFit={true} numberOfLines={1}>{context.bleDevice ? context.data : '--'}</Text>
                    </View>
                </View>
            </View>
        </Container>


    );
}

export default SetupScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        maxWidth: 180,
        maxHeight: 20,
        marginBottom: 10
    },
    block: {
        width: '100%',
        marginBottom: 20,
        padding: 20
    },
    button: {
        marginBottom: 10
    },
    respContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        borderWidth: 1,
        marginTop: 5,
        borderColor: '#ccc',
        minHeight: 100
    },
    valueText: {
        color: '#0075be',
        fontWeight: 'bold',
    }
});