import React, { useContext, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

import { Container, Button, Header, Left, Body, Right, Title, Subtitle, Icon } from 'native-base';

import { LineChart } from "react-native-chart-kit";

import SystemContext from "../context/sys-context";

function HomeScreen({ navigation }) {

    const context = useContext(SystemContext);

    useEffect(() => {
        context.setSystemLoaded();
    }, [])
    console.log('context.history',context.historyData)

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
                    <Button transparent>
                        <Icon name='ios-alert-circle' />
                    </Button>
                </Right>
            </Header>
            <View style={styles.container}>
                <View style={styles.mainDataContainer}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1}>Device name: {context.bleDevice ? context.bleDevice.name : '--'}</Text>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1}>Device address: {context.bleDevice ? context.bleDevice.id : '--'}</Text>
                    <Text style={styles.valueText} adjustsFontSizeToFit={true} numberOfLines={1}>{context.bleDevice ? context.data : '--'}</Text>
                </View>
                <View>
                    <LineChart
                        data={{
                            labels: context.historyData.map((elm, index) => (index + 1).toFixed(0)),
                            datasets: [
                                {
                                    data: context.historyData.map((elm) => elm),
                                }
                            ],
                            legend: ["Hardness"] // optional
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={220}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 1, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
                        bezier
                    />
                </View>

            </View>
        </Container>
    );
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        maxWidth: 180,
        maxHeight: 20,
        marginBottom: 10
    },
    valueText: {
        color: '#0075be',
        fontWeight: 'bold',
        fontSize: 64
    },
    mainDataContainer: {
        alignItems: 'center',
        marginVertical: 30,
        marginHorizontal: 20
    }
});
