import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useHeaderHeight } from "expo-router/build/react-navigation/index.js";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Crypto = () => {
  // Traditional way of calling an API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch("/api/listing");
  //     const data = await res.json();

  //     console.log(data);
  //   };
  //   fetchData();
  // }, []);

  const headerHeight = useHeaderHeight();

  // Using tanstack query
  const cryptoData = useQuery({
    queryKey: ["cryptodata"],
    queryFn: async () => {
      const res = await fetch("/api/listing?limit=20");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  // const ids = cryptoData?.data?.map((item: any) => item.id).join(",");

  // const {data: coinData} = useQuery({
  //   queryKey: ["coinData", ids],
  //   queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
  //   enabled: !!ids
  // })

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingVertical: headerHeight }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest Crypto</Text>
      <View style={defaultStyles.block}>
        {cryptoData.data?.map((item: any) => {
          return (
            <Link href={`/crypto/${item.id}`} key={item.id} asChild>
              <TouchableOpacity
                style={{ flexDirection: "row", gap: 14, alignItems: "center" }}
              >
                <Image
                  source={{
                    uri: `https://static.coinpaprika.com/coin/${item.id}/logo.png`,
                  }}
                  style={{ width: 40, height: 40 }}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontWeight: "600", color: Colors.dark }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: Colors.gray }}>{item.symbol}</Text>
                </View>
                <View style={{ gap: 6, alignItems: "flex-end" }}>
                  <Text>$ {item.quotes?.USD?.price.toFixed(2)}</Text>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Ionicons
                      name={
                        item.quotes?.USD?.percent_change_15m > 0
                          ? "caret-up"
                          : "caret-down"
                      }
                      size={16}
                      color={
                        item.quotes?.USD?.percent_change_15m > 0
                          ? "green"
                          : "red"
                      }
                    />
                    <Text
                      style={{
                        color:
                          item.quotes?.USD?.percent_change_15m > 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {item.quotes?.USD?.percent_change_15m.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Crypto;
