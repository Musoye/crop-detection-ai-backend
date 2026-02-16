import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TextInput, Pressable, ScrollView } from "../../../tw";
import * as Haptics from "expo-haptics";
import { Platform, Alert } from "react-native";
import { saveFarm } from "../../../stores/farm-store";

export default function AddFarmScreen() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [size, setSize] = useState("");
    const [cropType, setCropType] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name || !location || !cropType) {
            Alert.alert("Required Fields", "Please enter at least the farm name, location, and crop type.");
            return;
        }

        setIsSaving(true);
        try {
            await saveFarm({
                name,
                location,
                size,
                cropType,
            });

            if (Platform.OS === "ios") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", "Farm record created successfully!");
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to save farm record.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white" contentContainerClassName="p-6">
            <View className="mb-10">
                <Text className="text-3xl font-black text-sf-text mb-2">Add New Farm</Text>
                <Text className="text-sf-text-2">Enter the details of your farm to start tracking crop health.</Text>
            </View>

            <View className="gap-6">
                <View className="gap-2">
                    <Text className="font-bold text-sf-text ml-1">Farm Name</Text>
                    <TextInput
                        className="h-14 bg-sf-bg-2 rounded-2xl px-5 text-sf-text border border-sf-gray-2/20"
                        placeholder="e.g. North Valley Plots"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View className="gap-2">
                    <Text className="font-bold text-sf-text ml-1">Location / Zone</Text>
                    <TextInput
                        className="h-14 bg-sf-bg-2 rounded-2xl px-5 text-sf-text border border-sf-gray-2/20"
                        placeholder="e.g. Sector 4 - West"
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>

                <View className="flex-row gap-4">
                    <View className="flex-1 gap-2">
                        <Text className="font-bold text-sf-text ml-1">Size (Acres)</Text>
                        <TextInput
                            className="h-14 bg-sf-bg-2 rounded-2xl px-5 text-sf-text border border-sf-gray-2/20"
                            placeholder="e.g. 5"
                            value={size}
                            onChangeText={setSize}
                            keyboardType="numeric"
                        />
                    </View>
                    <View className="flex-1 gap-2">
                        <Text className="font-bold text-sf-text ml-1">Crop Variety</Text>
                        <TextInput
                            className="h-14 bg-sf-bg-2 rounded-2xl px-5 text-sf-text border border-sf-gray-2/20"
                            placeholder="e.g. Maize"
                            value={cropType}
                            onChangeText={setCropType}
                        />
                    </View>
                </View>

                <View className="mt-8 gap-4">
                    <Pressable
                        onPress={handleSave}
                        className="bg-primary h-16 rounded-2xl items-center justify-center shadow-lg"
                    >
                        <Text className="text-white text-lg font-bold">Create Farm Record</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => router.back()}
                        className="h-16 rounded-2xl items-center justify-center"
                    >
                        <Text className="text-sf-text-2 font-bold">Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
