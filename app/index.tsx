import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig.js";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Signup error:", error.message);
        Alert.alert("Error", error.message);
      } else {
        console.error("Signup error:", error);
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-8">
            {/* Branding */}
            <View className="items-center mb-8">
              <Text className="text-4xl font-bold text-blue-600">TeamPad</Text>
              <Text className="text-base text-gray-500 mt-1">Create your account</Text>
            </View>

            {/* Card */}
            <View className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
              {/* Email */}
              <Text className="text-sm text-gray-700 mb-1">Email</Text>
              <TextInput
                className="h-12 px-3 bg-white border border-gray-300 rounded-md mb-4 text-base text-black"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@example.com"
                placeholderTextColor="#888"
              />

              {/* Password */}
              <Text className="text-sm text-gray-700 mb-1">Password</Text>
              <TextInput
                className="h-12 px-3 bg-white border border-gray-300 rounded-md mb-6 text-base text-black"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#888"
              />

              {/* Sign Up Button */}
              <TouchableOpacity
                className="bg-blue-600 rounded-md py-3 items-center"
                onPress={handleSignUp}
              >
                <Text className="text-white text-base font-semibold">Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="items-center mt-6">
              <Text className="text-sm text-gray-600">
                Already have an account?
                <Text className="text-blue-600 font-semibold"> Log in</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
