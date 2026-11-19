import { Stack, useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useHeaderHeight } from "expo-router/build/react-navigation/index.js";
import { useEffect, useState } from "react";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { Circle, useFont } from "react-native-skia";
import { CartesianChart, Line, useChartPressState } from "victory-native";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const CryptoDetail = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [activeIndex, setActiveIndex] = useState(0);

  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  useEffect(() => {
    console.log(isActive);
    if (isActive) Haptics.selectionAsync();
  }, [isActive]);

  const { data } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      const res = await fetch(`/api/info?id=${id}`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: tickers } = useQuery({
    queryKey: ["tickers"],
    queryFn: async (): Promise<any[]> =>
      fetch(`/api/tickers?id=${id}`).then((res) => res.json()),
  });

  const animatedText = useAnimatedProps(() => {
    return {
      text: `$ ${state.y.price.value.value.toFixed(2)}`,
      defaultValue: "",
    };
  });

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: "",
    };
  });

  const categories = ["Overview", "News", "Orders", "Transactions"];

  return (
    <>
      <Stack.Screen options={{ title: data?.name }} />
      <SectionList
        style={{ flex: 1, marginTop: headerHeight }}
        contentContainerStyle={{ paddingBottom: 60 }}
        stickySectionHeadersEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={true}
        keyExtractor={(i) => i.title}
        sections={[{ data: [{ title: "Chart" }] }]}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.categoryTextActive
                      : styles.categoryText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 16,
              }}
            >
              <Text style={styles.subtitle}>{data && data?.name}</Text>
              <Image
                source={{
                  uri: `https://static.coinpaprika.com/coin/${id}/logo.png`,
                }}
                style={{ width: 60, height: 60 }}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primary,
                    flexDirection: "row",
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="add" size={24} color={"#fff"} />
                <Text style={[defaultStyles.buttonText, { color: "#fff" }]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primaryMuted,
                    flexDirection: "row",
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.primary }]}
                >
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={(item) => (
          <>
            <View style={[defaultStyles.block, { height: 550 }]}>
              {tickers && (
                <>
                  <View style={{ height: 75, justifyContent: "center" }}>
                    {!isActive && (
                      <View>
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: Colors.dark,
                          }}
                        >
                          $ {tickers[tickers.length - 1].price.toFixed(2)}
                        </Text>
                        <Text style={{ fontSize: 18, color: Colors.gray }}>
                          Today
                        </Text>
                      </View>
                    )}
                    {isActive && (
                      <View>
                        <AnimatedTextInput
                          editable={false}
                          underlineColorAndroid={"transparent"}
                          style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: Colors.dark,
                            padding: 0,
                            margin: 0,
                          }}
                          animatedProps={animatedText}
                        />
                        <AnimatedTextInput
                          editable={false}
                          underlineColorAndroid={"transparent"}
                          style={{
                            fontSize: 18,
                            color: Colors.gray,
                            padding: 0,
                            margin: 0,
                          }}
                          animatedProps={animatedDateText}
                        />
                      </View>
                    )}
                  </View>
                  <CartesianChart
                    chartPressState={state}
                    padding={{ bottom: 24, left: 10, right: 10, top: 10 }}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: 4, y: 4 },
                      labelColor: Colors.gray,
                      formatYLabel: (v) => `$ ${v}`,
                      formatXLabel: (ms) => format(new Date(ms), "MM/dd"),
                    }}
                    data={tickers!}
                    xKey="timestamp"
                    yKeys={["price"]}
                  >
                    {({ points }) => (
                      <>
                        <Line
                          points={points.price}
                          color={Colors.primary}
                          strokeWidth={3}
                        />
                        {isActive && (
                          <ToolTip
                            x={state.x.position}
                            y={state.y.price.position}
                          />
                        )}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>
                {data && data?.description}
              </Text>
            </View>
          </>
        )}
      ></SectionList>
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: "#000",
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});

export default CryptoDetail;
