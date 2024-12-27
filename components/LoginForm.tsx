import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";
import { useState } from "react";

type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [loginInputs, setLoginInputs] = useState<LoginInputs>({
    email: "",
    password: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}> Login </Text>
      <View>
        <TextInput
          placeholder="Email"
          style={styles.inputStyle}
          value={loginInputs.email}
          onChangeText={(text) =>
            setLoginInputs({
              ...loginInputs,
              email: text,
            })
          }
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          style={styles.inputStyle}
          value={loginInputs.password}
          onChangeText={(text) =>
            setLoginInputs({
              ...loginInputs,
              password: text,
            })
          }
        />
        <TouchableOpacity style={styles.button}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },

  formLabel: {
    fontSize: 20,
    color: "#fff",
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#DCDCDC",
  },
  formText: {
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 20,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FFF",
    paddingVertical: 5,
    borderRadius: 50,
  },
});
