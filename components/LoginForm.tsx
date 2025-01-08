import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLoginMutation } from "@/queries/authQueries";
import { useRouter } from "expo-router";

type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const { mutate: login } = useLoginMutation();

  const onSubmit = async (data: LoginInputs) => {
    login(data, {
      onSuccess() {
        console.log("logged in successfully");
        router.replace("/");
      },
      onError(e) {
        console.error("e", e.message);
        console.error(e);
      },
    });
  };

  // const onSubmit = useCallback(
  //   async (data: LoginInputs) => {
  //     login(data, {
  //       onSuccess() {
  //         console.log("logged in successfully");
  //       },
  //       onError(e) {
  //         console.error("e", e.message);
  //         console.error(e);
  //       },
  //     });
  //   },
  //   [login]
  // );

  // const [loginInputs, setLoginInputs] = useState<LoginInputs>({
  //   email: "",
  //   password: "",
  // });

  // function submit() {
  //   if (loginInputs.email && loginInputs.password) {
  //     console.log(loginInputs.email);
  //     setLoginInputs({
  //       email: "",
  //       password: "",
  //     });
  //   } else {
  //     console.log("inputs must NOT be empty");
  //     setLoginInputs({
  //       ...loginInputs,
  //       password: "",
  //     });
  //   }
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}> Login </Text>
      <View>
        <Text style={styles.formLabel}>Email:</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.inputStyle}
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && <Text>This is required.</Text>}

        <Text style={styles.formLabel}>Password:</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.inputStyle}
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && <Text>This is required.</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.text}>Submit</Text>
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
    marginTop: 20,
    fontSize: 20,
    color: "#fff",
  },
  inputStyle: {
    marginTop: 5,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#DCDCDC",
  },
  formText: {
    alignItems: "center",
    justifyContent: "center",
    color: "#aaa",
    fontSize: 20,
  },
  text: {
    color: "#000",
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
