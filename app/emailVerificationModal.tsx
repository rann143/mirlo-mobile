import { useAuthContext } from "@/state/AuthContext";
import * as api from "../queries/fetch/fetchWrapper";
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { V } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { useQueryClient } from "@tanstack/react-query";
import { Pressable, TextInput, View, Text } from "react-native";

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

  const verifyEmail = useCallback(
    async (emailInput: VerifyEmailInputs) => {
      try {
        setIsLoading(true);
        await api.post("/auth/verify-email", emailInput);
        setEmail(emailInput.email);
        setWaitingForVerification(true);
      } catch (err) {
        console.error("issue verifying email", err);
      } finally {
        setIsLoading(false);
      }
    },
    [email]
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

  return waitingForVerification ? (
    <View>
      <Controller
        control={controlCode}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="code"
      />
      <Pressable onPress={handleSubmitCode(verifyCode)}>
        <Text>Verify</Text>
      </Pressable>
    </View>
  ) : (
    <View>
      <Controller
        control={controlEmail}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="email"
      />
      <Pressable onPress={handleSubmitEmail(verifyEmail)}>
        <Text>Send Verification Code</Text>
      </Pressable>
    </View>
  );
}
