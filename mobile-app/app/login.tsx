import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TextInput, Pressable, ScrollView } from "../tw";
import { Icon } from "../components/icon";
import * as Haptics from "expo-haptics";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("admin@test.com");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsLoading(true);
        // Mimic API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (email === "admin@test.com" && password === "password123") {
            if (Platform.OS === "ios") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/(tabs)/(scan)");
        } else {
            if (Platform.OS === "ios") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", "Invalid email or password");
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerClassName="flex-grow justify-center px-8 py-12">
                <View className="mb-12 items-center">
                    <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-6">
                        <Icon name="leaf" size={48} color="#1E3A8A" />
                    </View>
                    <Text className="text-3xl font-black text-sf-text mb-2">Welcome Back</Text>
                    <Text className="text-sf-text-2 text-center">
                        Log in to manage your farms and track crop health.
                    </Text>
                </View>

                <View className="gap-5">
                    <View className="gap-2">
                        <Text className="font-semibold text-sf-text ml-1">Email Address</Text>
                        <View className="flex-row items-center bg-sf-bg-2 rounded-2xl px-4 border border-sf-gray-2/20">
                            <Icon name="mail-outline" size={20} color="#636366" />
                            <TextInput
                                className="flex-1 h-14 ml-3 text-sf-text"
                                placeholder="admin@test.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View className="gap-2">
                        <Text className="font-semibold text-sf-text ml-1">Password</Text>
                        <View className="flex-row items-center bg-sf-bg-2 rounded-2xl px-4 border border-sf-gray-2/20">
                            <Icon name="lock-closed-outline" size={20} color="#636366" />
                            <TextInput
                                className="flex-1 h-14 ml-3 text-sf-text"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <Pressable className="self-end p-2">
                        <Text className="text-primary font-semibold text-sm">Forgot Password?</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleLogin}
                        disabled={isLoading}
                        className={`h-14 rounded-2xl items-center justify-center shadow-md mt-4 ${isLoading ? "bg-primary/70" : "bg-primary"
                            }`}
                    >
                        <Text className="text-white text-lg font-bold">
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Text>
                    </Pressable>
                </View>

                <View className="mt-12 flex-row justify-center items-center gap-2">
                    <Text className="text-sf-text-2">Don't have an account?</Text>
                    <Pressable>
                        <Text className="text-primary font-bold">Sign Up</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
