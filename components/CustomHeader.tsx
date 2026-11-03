import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  return (
    <BlurView intensity={80} tint="extraLight" style={{ paddingTop: top }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.roundBtn}>
          <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>
            VK
          </Text>
        </TouchableOpacity>
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.dark}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor={Colors.dark}
          />
        </View>
        <View style={styles.circle}>
          <Ionicons name={"stats-chart"} size={20} color={Colors.dark} />
        </View>
        <View style={styles.circle}>
          <Ionicons name={"card"} size={24} color={Colors.dark} />
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "transparent",
    height: 60,
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.lightGray,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 0,
    color: Colors.dark,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomHeader;
