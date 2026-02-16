import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "../tw";
import { Icon } from "../components/icon";
import * as Haptics from "expo-haptics";
import { Platform, Alert } from "react-native";
import { getFarms, FarmRecord } from "../stores/farm-store";

export default function SaveRecordScreen() {
    const params = useLocalSearchParams<{ diagId?: string }>();
    const [notes, setNotes] = useState("");
    const [farms, setFarms] = useState<FarmRecord[]>([]);
    const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFarms();
    }, []);

    const loadFarms = async () => {
        try {
            const fetchedFarms = await getFarms();
            setFarms(fetchedFarms);
            if (fetchedFarms.length > 0) {
                setSelectedFarm(fetchedFarms[0].id);
            }
        } catch (error) {
            console.error("Failed to load farms", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedFarm) {
            Alert.alert("No Farm Selected", "Please select a farm to assign this record to.");
            return;
        }
        if (Platform.OS === "ios") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const farmName = farms.find(f => f.id === selectedFarm)?.name || "selected farm";
        Alert.alert("Success", "Record saved to " + farmName);
        router.dismissAll();
        router.replace("/(tabs)/(history)");
    };

    return (
        <ScrollView className="flex-1 bg-white" contentContainerClassName="p-6">
            <View className="flex-row items-center mb-10">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2 mr-2">
                    <Icon name="close" size={24} color="#1E3A8A" />
                </Pressable>
                <Text className="text-2xl font-black text-sf-text">Save Diagnosis</Text>
            </View>

            <View className="gap-8">
                <View className="gap-3">
                    <Text className="font-bold text-sf-text text-lg">Assign to Farm</Text>
                    {isLoading ? (
                        <ActivityIndicator color="#1E3A8A" />
                    ) : farms.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                            {farms.map((farm) => (
                                <Pressable
                                    key={farm.id}
                                    onPress={() => setSelectedFarm(farm.id)}
                                    className={`px-5 py-3 rounded-2xl border mr-2 ${selectedFarm === farm.id
                                        ? "bg-primary border-primary"
                                        : "bg-sf-bg-2 border-sf-gray-2/20"
                                        }`}
                                >
                                    <Text className={`font-bold ${selectedFarm === farm.id ? "text-white" : "text-sf-text-2"}`}>
                                        {farm.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    ) : (
                        <Pressable
                            onPress={() => router.push("/(tabs)/(add)")}
                            className="bg-sf-bg-2 border border-dashed border-sf-gray-2/40 p-4 rounded-2xl items-center"
                        >
                            <Text className="text-sf-text-2 font-bold">+ Add your first farm</Text>
                        </Pressable>
                    )}
                </View>

                <View className="gap-3">
                    <Text className="font-bold text-sf-text text-lg">Doctor's Notes</Text>
                    <TextInput
                        multiline
                        numberOfLines={6}
                        className="bg-sf-bg-2 rounded-3xl p-5 text-sf-text border border-sf-gray-2/20 min-h-[150px]"
                        placeholder="Add any observations or actions taken..."
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                <View className="bg-secondary/5 border border-secondary/20 p-5 rounded-3xl flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-secondary/10 rounded-full items-center justify-center">
                        <Icon name="notifications-outline" size={20} color="#10B981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-secondary">Reminder Set</Text>
                        <Text className="text-xs text-secondary/70">Check this crop again in 5 days</Text>
                    </View>
                </View>

                <View className="mt-4 gap-4">
                    <Pressable
                        onPress={handleSave}
                        className="bg-primary h-16 rounded-2xl items-center justify-center shadow-lg"
                    >
                        <Text className="text-white text-lg font-bold">Confirm & Save</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
