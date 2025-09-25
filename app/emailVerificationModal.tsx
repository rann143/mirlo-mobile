import { useAuthContext } from "@/state/AuthContext";
import * as api from "../queries/fetch/fetchWrapper";
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mirloRed } from "@/constants/mirlo-red";
import { useRouter } from "expo-router";

type VerifyEmailInputs = {
  email: string;
};
type verifyCodeInputs = {
  code: string;
};

export default function emailVerificationModal() {
  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<VerifyEmailInputs>({
    defaultValues: {
      email: "",
    },
  });
  const {
    control: controlCode,
    handleSubmit: handleSubmitCode,
    reset: resetCode,
    formState: { errors: codeErrors },
  } = useForm<verifyCodeInputs>({
    defaultValues: {
      code: "",
    },
  });
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const verifyEmail = useCallback(
    async (emailInput: VerifyEmailInputs) => {
      try {
        setIsLoading(true);
        await api.post("/auth/verify-email", emailInput);
        setEmail(emailInput.email);
        setWaitingForVerification(true);

        resetCode();
      } catch (err) {
        console.error("issue verifying email", err);
      } finally {
        setIsLoading(false);
      }
    },
    [email, resetCode]
  );

  const verifyCode = useCallback(
    async (code: verifyCodeInputs) => {
      try {
        setIsLoading(true);
        if (email) {
          const response = await api.post<
            { email: string; code: string },
            { userId: string }
          >("/auth/verify-email", { ...code, email });
          if (response.userId) {
            setEmailVerified(true);

            queryClient.invalidateQueries({
              predicate: (query) => query.queryKey.includes("auth"),
            });
            router.dismiss();
          }
        }
      } catch (err) {
        console.error("issue verifying code", err);
      } finally {
        setIsLoading(false);
      }
    },
    [email, queryClient, setEmailVerified]
  );

  return !waitingForVerification ? (
    <SafeAreaView style={styles.container}>
      <Text style={styles.formLabel}>Email</Text>
      <Controller
        key="email-controller"
        control={controlEmail}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            key="email-input"
            style={styles.inputStyle}
            placeholderTextColor="#555"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />
      <Pressable style={styles.button} onPress={handleSubmitEmail(verifyEmail)}>
        <Text style={styles.text}>Verify</Text>
      </Pressable>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Text style={styles.formLabel}>Verification Code</Text>
      <Controller
        key="code-controller"
        control={controlCode}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            key="verification-code-input"
            style={styles.inputStyle}
            placeholderTextColor="#555"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="code"
      />
      <Pressable style={styles.button} onPress={handleSubmitCode(verifyCode)}>
        <Text style={styles.text}>Send Verification Code</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: mirloRed,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    flex: 1,
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
    backgroundColor: "white",
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
