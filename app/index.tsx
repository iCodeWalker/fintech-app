import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useAssets } from "expo-asset";
import { Link } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Page = () => {
  const [assets] = useAssets([require("@/assets/videos/intro.mp4")]);

  const player = useVideoPlayer(assets?.[0]?.uri ?? "", (player) => {
    player.loop = true;
    player.muted = true;
    player.playbackRate = 0.5;
    player.play();
  });

  return (
    <View style={styles.container}>
      {assets && (
        <VideoView
          player={player}
          style={styles.video}
          nativeControls={false}
          contentFit="cover"
        />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>
          Ready to change the way your money works?
        </Text>
      </View>

      <View style={styles.buttons}>
        <Link
          href="/login"
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.dark },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "500",
                color: "white",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </Link>

        <Link
          href="/signup"
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: "#fff" },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  header: {
    fontSize: 24,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "white",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "500",
  },
});

export default Page;
