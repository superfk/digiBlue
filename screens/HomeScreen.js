import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";

import {
  Container,
  Button as NativeButton,
  Footer,
  FooterTab,
  Icon,
} from "native-base";

import SystemContext from "../context/sys-context";
import { useState } from "react";

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

function HomeScreen({ navigation }) {
  const context = useContext(SystemContext);

  const [data, setData] = useState([
    {
      title: "Main dishes",
      data: ["Pizza", "Burger", "Risotto"],
    },
    {
      title: "Sides",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
    {
      title: "Drinks",
      data: ["Water", "Coke", "Beer"],
    },
    {
      title: "Desserts",
      data: ["Cheese Cake", "Ice Cream"],
    },
  ]);

  useEffect(() => {
    context.setSystemLoaded();
  }, []);

  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <Container>
      {/* <Header style={styles.head}>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Image
            style={styles.logo}
            source={require("../assets/Bareiss_LOGO.png")}
          />
          <Subtitle>digiBlue</Subtitle>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="ios-alert-circle" />
          </Button>
        </Right>
      </Header> */}
      <View style={styles.body}>
        <View style={styles.upperContainer}>
          <View style={styles.mainProdInfoRow}>
            <Text style={styles.deviceModelText}>HPE III</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={styles.otherModelText}>
                Other Bareiss Instruments
              </Text>
              <Icon
                name="caret-right"
                type="FontAwesome"
                style={{
                  color: "white",
                  fontSize: 20,
                  marginLeft: 5,
                }}
              />
            </View>
          </View>
          <View style={styles.mainProdImageRow}>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => {}}>
              <Text style={{ color: "white", fontSize: 12 }}>
                {" "}
                Check Status
              </Text>
            </TouchableOpacity>
            <View style={styles.deviceContainer}>
              <View style={styles.deviceBlueCircle}>
                <Image
                  source={require("../assets/blueCircle.png")}
                  style={{
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View style={styles.deviceAnchor}>
                <Image
                  source={require("../assets/prodHPE3.png")}
                  style={{
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          <View style={styles.info}>
            <View style={styles.infoHead}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold"
                }}
              >
                INFO
              </Text>
            </View>
            <ScrollView>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </ScrollView>
          </View>
        </View>
      </View>

      <Footer style={styles.foot}>
        <FooterTab style={styles.footTab}>
          <NativeButton style={styles.btn}>
            <Image
              style={styles.footIcon}
              source={require("../assets/iconHPE.png")}
            />
          </NativeButton>
          <NativeButton>
            <Image
              style={styles.footIcon}
              source={require("../assets/iconLocation.png")}
            />
          </NativeButton>
          <NativeButton>
            <Image
              style={styles.footIcon}
              source={require("../assets/iconUser.png")}
            />
          </NativeButton>
        </FooterTab>
      </Footer>
    </Container>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#6196FF",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6196FF",
  },
  logo: {
    maxWidth: 180,
    maxHeight: 20,
    marginBottom: 10,
  },
  btn: {
    height: "100%",
    padding: 0,
    margin: 0,
  },
  deviceModelText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  otherModelText: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  upperContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
    paddingTop: 50,
    zIndex: 2,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mainProdInfoRow: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mainProdImageRow: {
    width: "100%",
    height: "60%",
    position: "relative",
  },
  outlineBtn: {
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 5,
    color: "white",
    width: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
    top: 0,
    left: 40,
  },
  deviceContainer: {
    height: "100%",
    position: "relative",
    top: 0,
    right: 30,
    bottom: 0,
  },
  deviceBlueCircle: {
    position: "absolute",
    top: 10,
    right: -20,
    bottom: 0,
    zIndex: 2,
  },
  deviceAnchor: {
    position: "absolute",
    top: 65,
    right: -55,
    bottom: 0,
    zIndex: 3,
  },
  lowerContainer: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 370,
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  foot: {
    backgroundColor: "#F2F2F2",
  },
  footTab: {
    padding: 0,
    margin: 0,
    backgroundColor: "#F2F2F2",
  },
  footIcon: {
    maxHeight: "100%",
    maxWidth: 36,
  },
  valueText: {
    color: "#0075be",
    fontWeight: "bold",
    fontSize: 64,
  },
  mainDataContainer: {
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 20,
  },
  info: {
    paddingTop: 50,
    paddingHorizontal: 50,
    width: "100%",
  },
  item: {
    padding: 10,
    marginVertical: 8,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
  },
});
