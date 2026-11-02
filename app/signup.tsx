import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Signup = () => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 100;
  const behavior = Platform.OS === "ios" ? "padding" : "height";

  const handleSignUp = () => {};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number, to get started.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Country Code"
            placeholderTextColor={Colors.gray}
            style={styles.input}
            value={countryCode}
          />
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={Colors.gray}
            style={[styles.input, { flex: 1 }]}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <Link href="/login" replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={[
              defaultStyles.pillButton,
              phoneNumber !== "" ? styles.enabled : styles.disabled,
              { marginVertical: 20 },
            ]}
            onPress={handleSignUp}
          >
            <Text style={defaultStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default Signup;
