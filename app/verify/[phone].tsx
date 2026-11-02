import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useSignIn, useSignUp } from "@clerk/expo";
import { Link, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();

  const [code, setCode] = useState("");

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const verifyCode = async () => {
    try {
      if (!signUp) return;
      // 1. Verify the code
      const { error } = await signUp.verifications.verifyPhoneCode({ code });
      if (error) {
        Alert.alert("Verification Error", error.message);
        return;
      }
      // 2. Finalize and activate the user session
      await signUp.finalize();
    } catch (error) {
      Alert.alert("Finalization Error", (error as Error).message);
    }
  };

  const verifySignIn = async () => {};

  useEffect(() => {
    if (code.length === 6) {
      console.log("Code entered:", code);
      if (signin === "true") {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit Code</Text>
      <Text style={defaultStyles.descriptionText}>Code sent to {phone}.</Text>

      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        testID="my-code-input"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text
                key={index}
                style={[styles.cellText, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused && <Cursor />)}
              </Text>
            </View>
            {index === 2 ? (
              <View key={`separator-${index}`} style={styles.seperator} />
            ) : null}
          </Fragment>
        )}
      />

      <Link href="/login" replace asChild>
        <TouchableOpacity>
          <Text style={[defaultStyles.textLink]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
  seperator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: "center",
  },
});

export default Page;
