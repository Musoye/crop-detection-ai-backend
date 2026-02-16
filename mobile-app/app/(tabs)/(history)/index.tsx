import React, { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "../../../tw";
import { Icon } from "../../../components/icon";
import { getScans, ScanRecord } from "../../../stores/scan-store";

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const scans = await getScans();
      setHistory(scans);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const query = search.toLowerCase();
    // Assuming we might have a farm name or crop name in the record or related data
    // For now, let's search by health class or ID since that's what we have
    return item.detections.some(d => d.class.toLowerCase().includes(query)) ||
      item.id.toLowerCase().includes(query);
  });
  return (
    <View className="flex-1 bg-white">
      <View className="p-6 pb-2">
        <Text className="text-3xl font-black text-sf-text mb-6">Diagnosis History</Text>
        <View className="flex-row items-center bg-sf-bg-2 rounded-2xl px-4 h-12 border border-sf-gray-2/20 mb-4">
          <Icon name="search-outline" size={20} color="#8E8E93" />
          <TextInput
            className="flex-1 ml-3 text-sf-text"
            placeholder="Search scans..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-6 pt-0">
        {isLoading ? (
          <ActivityIndicator color="#1E3A8A" className="mt-10" />
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const severity = item.healthPercentage > 80 ? "low" : item.healthPercentage > 40 ? "medium" : "high";

            return (
              <Pressable
                key={item.id}
                onPress={() => router.push({ pathname: "/results", params: { scanId: item.id } })}
                className="bg-white border border-sf-gray-2/10 p-5 rounded-3xl mb-4 shadow-sm flex-row items-center gap-4"
              >
                <View className={`w-14 h-14 rounded-2xl items-center justify-center ${severity === "low" ? "bg-secondary/10" :
                  severity === "medium" ? "bg-warning/10" : "bg-danger/10"
                  }`}>
                  <Icon
                    name={severity === "low" ? "checkmark-circle" : "alert-circle"}
                    size={28}
                    color={severity === "low" ? "#10B981" : severity === "medium" ? "#F59E0B" : "#EF4444"}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-lg font-black text-sf-text">
                      {item.healthPercentage}% Healthy
                    </Text>
                    <Text className="text-xs font-bold text-sf-text-2 uppercase">{formatDate(item.timestamp)}</Text>
                  </View>
                  <Text className="text-sm text-sf-text-2">
                    {item.totalDetections} Detections • {item.type.toUpperCase()}
                  </Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View className="items-center py-20">
            <Icon name="time-outline" size={64} color="#E5E5EA" />
            <Text className="text-sf-text-2 mt-4 font-semibold">No scan history found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
