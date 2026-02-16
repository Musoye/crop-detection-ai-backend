import React, { useEffect } from "react";
import { router } from "expo-router";
import { View, Text } from "../tw";
import { Icon } from "../components/icon";

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/onboarding");
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 bg-primary items-center justify-center">
            <View className="items-center gap-4">
                <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center shadow-lg">
                    <Icon name="leaf" size={60} color="#fff" />
                </View>
                <Text className="text-white text-3xl font-black tracking-tighter">
                    CROP<Text className="text-secondary-light">WATCH</Text>
                </Text>
                <Text className="text-white/60 text-sm font-medium tracking-widest uppercase">
                    AI Farm Advisor
                </Text>
            </View>
        </View>
    );
}
