import React, { useContext, useEffect, useRef, useCallback } from "react";
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
  Easing,
  SafeAreaView,
} from "react-native";

import {
  Container,
  Button as NativeButton,
  Footer,
  FooterTab,
  Icon,
  List,
  ListItem,
  Left,
  Right,
} from "native-base";

import SquareButton from "../components/SquareButton";

import { AnimatedCircularProgress } from "react-native-circular-progress";
import Carousel from "react-native-snap-carousel";

import SystemContext from "../context/sys-context";
import { useState } from "react";

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

function HomeScreen({ navigation }) {
  const context = useContext(SystemContext);
  const circleRef = useRef(null);
  const scrollRef = useRef(null);
  const carouselRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [buttonsData, setButtonsData] = useState([
    {
      label: "Start a Test",
      name: "Start a Test",
    },
    {
      label: "Instrument Finder",
      name: "Instrument Finder",
    },
    {
      label: "Schedule Service",
      name: "Schedule Service",
    },
    {
      label: "Activity logs",
      name: "Activity logs",
    },
  ]);

  const [data, setData] = useState([
    {
      title: "Model",
      value: "HPE III Shore A",
    },
    {
      title: "S/N",
      value: "807724",
    },
    {
      title: "No. of Measurements",
      value: "173",
    },
    {
      title: "Last Calibration",
      value: "07.21.2020",
    },
  ]);

  useEffect(() => {
    context.setSystemLoaded();
  }, []);

  const onCheckStatus = useCallback(() => {
    const rdn = parseInt(Math.random() * 100);
    circleRef.current.animate(rdn, 1000, Easing.quad);
  }, [circleRef]);

  const onStartTest = useCallback((e) => {
    console.log("start a test");
  }, []);

  const moveBody = (index) => {
    scrollRef.current.scrollTo({
      x: index * width,
      animation: false,
    });
  };

  const infoItems = data.map((item) => {
    return (
      <ListItem key={item.title}>
        <Left>
          <Text>{item.title}</Text>
        </Left>
        <Right>
          <Text>{item.value}</Text>
        </Right>
      </ListItem>
    );
  });

  const _renderItem = ({ item, index }) => {
    return <SquareButton text={item.label} clicked={onStartTest} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#6196FF" }}>
      <Container>
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
              <View>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={onCheckStatus}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    Check Status
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.deviceContainer}>
                <View style={styles.deviceBlueCircle}>
                  {/* <Image
                  source={require("../assets/blueCircle.png")}
                  style={{
                    resizeMode: "contain",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                /> */}
                  <AnimatedCircularProgress
                    ref={circleRef}
                    style={styles.circleBar}
                    size={Dimensions.get("window").width / 2 - 25}
                    width={12}
                    fill={0}
                    lineCap="round"
                    tintColor="#FFF684"
                    onAnimationComplete={() =>
                      console.log("onAnimationComplete")
                    }
                    backgroundColor="#CADFF2"
                    rotation={220}
                    arcSweepAngle={280}
                  />
                  <View style={styles.deviceAnchor}>
                    <Image
                      source={require("../assets/prodHPE3.png")}
                      style={{
                        resizeMode: "contain",
                        maxHeight: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.lowerContainer}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Carousel
                ref={carouselRef}
                layout={"default"}
                data={buttonsData}
                renderItem={_renderItem}
                sliderWidth={Dimensions.get("window").width}
                itemWidth={Dimensions.get("window").width / 3}
                inactiveSlideScale={0.7}
                inactiveSlideOpacity={0.8}
                containerCustomStyle={styles.buttonRow}
                loop={true}
                loopClonesPerSide={2}
                onSnapToItem={(index) => {
                  console.log(index);
                }}
              />
            </View>
            <ScrollView style={styles.info}>
              <View style={styles.infoHead}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  INFO
                </Text>
              </View>
              <View >
                <List>{infoItems}</List>
              </View>
            </ScrollView>
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
    </SafeAreaView>
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
    maxHeight: "35%",
    position: "relative",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    marginHorizontal: 20,
  },
  deviceContainer: {
    maxHeight: Dimensions.get("window").width / 2,
    width: Dimensions.get("window").width / 2,
    height: "100%",
    position: "relative",
  },
  deviceBlueCircle: {
    height: Dimensions.get("window").width / 2,
    width: Dimensions.get("window").width / 2,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    // borderWidth: 1,
    // borderColor: 'orange',
  },
  circleBar: {
    height: Dimensions.get("window").width / 2 - 20,
    width: Dimensions.get("window").width / 2 - 20,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
  },
  deviceAnchor: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: "30%",
    right: "-10%",
    bottom: 0,
    zIndex: 3,
  },
  lowerContainer: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: "46%",
    left: 0,
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    flexDirection: "column",
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
    paddingTop: 20,
    paddingHorizontal: 30,
    width: "100%",
    flex: 1,
    overflow: 'scroll',
  },
  item: {
    padding: 2,
    marginVertical: 6,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 12,
  },
  buttonRow: {
    marginTop: 80,
    width: "100%",
  },
});
