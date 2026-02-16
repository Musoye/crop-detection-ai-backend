import React, { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "../../../tw";
import { Icon } from "../../../components/icon";
import { getFarms, FarmRecord } from "../../../stores/farm-store";
import { getScans } from "../../../stores/scan-store";

export default function DashboardScreen() {
  const [farms, setFarms] = useState<FarmRecord[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [fetchedFarms, fetchedScans] = await Promise.all([
        getFarms(),
        getScans()
      ]);
      setFarms(fetchedFarms);
      setScanCount(fetchedScans.length);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-6 pb-24"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-10">
        <View>
          <Text className="text-sf-text-2 font-semibold">Good Morning,</Text>
          <Text className="text-2xl font-black text-sf-text">Admin One</Text>
        </View>
        <Pressable className="w-12 h-12 bg-sf-bg-2 rounded-full items-center justify-center">
          <Icon name="person-circle-outline" size={32} color="#1E3A8A" />
        </Pressable>
      </View>

      {/* Stats Cards */}
      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-primary p-5 rounded-3xl shadow-sm">
          <Text className="text-white/70 font-semibold mb-1">Total Farms</Text>
          <Text className="text-3xl font-black text-white">{farms.length.toString().padStart(2, '0')}</Text>
        </View>
        <View className="flex-1 bg-secondary p-5 rounded-3xl shadow-sm">
          <Text className="text-white/70 font-semibold mb-1">Active Scans</Text>
          <Text className="text-3xl font-black text-white">{scanCount.toString().padStart(2, '0')}</Text>
        </View>
      </View>

      {/* Quick Scan Primary CTA */}
      <Pressable
        onPress={() => router.push("/camera")}
        className="bg-primary/5 border border-primary/20 p-6 rounded-3xl flex-row items-center gap-4 mb-8"
      >
        <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center">
          <Icon name="scan" size={28} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-primary">New Crop Scan</Text>
          <Text className="text-sf-text-2 text-sm">Scan leaf for instant diagnosis</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#1E3A8A" />
      </Pressable>

      {/* Farms List */}
      <View>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-black text-sf-text">My Farms</Text>
          <Pressable onPress={() => router.push("/(tabs)/(add)")}>
            <Text className="text-primary font-bold">Add Farm</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#1E3A8A" className="mt-4" />
        ) : farms.length > 0 ? (
          farms.map((farm) => (
            <Pressable
              key={farm.id}
              className="bg-white border border-sf-gray-2/10 p-4 rounded-2xl flex-row items-center gap-4 mb-3 shadow-sm"
            >
              <View className={`w-12 h-12 rounded-xl items-center justify-center ${farm.health === "Healthy" ? "bg-secondary/10" :
                farm.health === "Warning" ? "bg-warning/10" : "bg-danger/10"
                }`}>
                <Icon
                  name="leaf-outline"
                  size={24}
                  color={farm.health === "Healthy" ? "#10B981" : farm.health === "Warning" ? "#F59E0B" : "#EF4444"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-sf-text">{farm.name}</Text>
                <Text className="text-sf-text-2 text-sm">{farm.location}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${farm.health === "Healthy" ? "bg-secondary/10" :
                farm.health === "Warning" ? "bg-warning/10" : "bg-danger/10"
                }`}>
                <Text className={`text-xs font-bold ${farm.health === "Healthy" ? "text-secondary" :
                  farm.health === "Warning" ? "text-warning" : "text-danger"
                  }`}>
                  {farm.health}
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View className="items-center py-10 bg-sf-bg-2 rounded-3xl border border-dashed border-sf-gray-2/30">
            <Icon name="business-outline" size={48} color="#8E8E93" />
            <Text className="text-sf-text-2 mt-4 font-semibold text-center px-10">
              No farms added yet. Add your first farm to track its health.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
