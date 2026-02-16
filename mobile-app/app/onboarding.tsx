import React, { useState, useRef } from "react";
import {
    Dimensions,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";
import { View, Text, Pressable } from "../tw";
import { Icon } from "../components/icon";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ONBOARDING_DATA = [
    {
        id: "1",
        title: "Protect Your Harvest",
        description:
            "Use AI-powered detection to identify crop diseases instantly and save your yields.",
        icon: "shield-checkmark-outline",
        color: "#1E3A8A",
    },
    {
        id: "2",
        title: "Organize Your Farms",
        description:
            "Group crops by location and size for better tracking and personalized management.",
        icon: "business-outline",
        color: "#10B981",
    },
    {
        id: "3",
        title: "Instant Diagnosis",
        description:
            "Upload or take a photo to get accurate disease identifications in seconds.",
        icon: "scan-outline",
        color: "#1E3A8A",
    },
    {
        id: "4",
        title: "Smart History",
        description:
            "Save records, add notes, and monitor your farm's health over time with detailed logs.",
        icon: "time-outline",
        color: "#10B981",
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<FlatList>(null);

    const handleScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            scrollRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            router.replace("/login");
        }
    };

    const handleSkip = () => {
        router.replace("/login");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Skip */}
            <View className="absolute top-6 right-6 z-10">
                <Pressable onPress={handleSkip}>
                    <Text className="text-primary font-semibold text-lg">
                        Skip
                    </Text>
                </Pressable>
            </View>

            {/* Slides */}
            <FlatList
                ref={scrollRef}
                data={ONBOARDING_DATA}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onMomentumScrollEnd={handleScrollEnd}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width,
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 32,
                            marginTop: 80,
                        }}
                    >
                        <View className="items-center">
                            <View
                                style={{
                                    width: 224,
                                    height: 224,
                                    borderRadius: 9999,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 40,
                                    backgroundColor: item.color + "15",
                                }}
                            >
                                <Icon
                                    name={item.icon as any}
                                    size={100}
                                    color={item.color}
                                />
                            </View>

                            <Text className="text-3xl font-extrabold text-sf-text text-center mb-4">
                                {item.title}
                            </Text>

                            <Text className="text-lg text-sf-text-2 text-center px-2 pb-4">
                                {item.description}
                            </Text>
                        </View>
                    </View>
                )}
            />

            {/* Footer */}
            <View className="py-10 px-10">
                {/* Pagination */}
                <View className="flex-row justify-center space-x-2 mb-8">
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 rounded-full ${index === currentIndex
                                    ? "w-8 bg-primary"
                                    : "w-2 bg-sf-gray-2"
                                }`}
                        />
                    ))}
                </View>

                {/* Button */}
                <Pressable
                    onPress={handleNext}
                    className="bg-primary py-5 rounded-2xl items-center"
                >
                    <Text className="text-white text-xl font-bold">
                        {currentIndex === ONBOARDING_DATA.length - 1
                            ? "Get Started"
                            : "Next"}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
