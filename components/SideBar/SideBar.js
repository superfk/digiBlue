import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';


export default function SideBar(props) {

    return (
        <DrawerContentScrollView {...props}>
            <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                <Image style={styles.logo} source={require('../../assets/Bareiss_LOGO.png')} />
            </View>
            <ScrollView>
                <DrawerItemList {...props} />
            </ScrollView>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 50,
    },
    logo: {
        maxWidth: 180,
        maxHeight: 20
    },
});
