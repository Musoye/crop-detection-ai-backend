import React from "react";
import { router } from "expo-router";
import { View, Text, ScrollView, Pressable } from "../../../tw";
import { Icon } from "../../../components/icon";
import { Alert } from "react-native";

export default function SettingsScreen() {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => router.replace("/login") },
    ]);
  };

  const menuItems = [
    { icon: "notifications-outline", label: "Push Notifications", value: "On" },
    { icon: "moon-outline", label: "Dark Mode", value: "Off" },
    { icon: "language-outline", label: "Language", value: "English" },
    { icon: "shield-outline", label: "Privacy Policy", value: "" },
    { icon: "help-circle-outline", label: "Support", value: "" },
  ];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="p-6">
      <Text className="text-3xl font-black text-sf-text mb-8">Profile</Text>

      {/* Profile Header */}
      <View className="items-center mb-10">
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
          <Icon name="person" size={50} color="#1E3A8A" />
          <Pressable className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white">
            <Icon name="camera" size={16} color="#fff" />
          </Pressable>
        </View>
        <Text className="text-2xl font-black text-sf-text">Admin One</Text>
        <Text className="text-sf-text-2">admin@test.com</Text>
      </View>

      {/* Menu Sections */}
      <View className="gap-2 mb-10">
        <Text className="text-xs font-bold text-sf-text-2 uppercase tracking-widest ml-1 mb-2">App Settings</Text>
        {menuItems.map((item, i) => (
          <Pressable
            key={i}
            className="flex-row items-center justify-between p-4 bg-sf-bg-2 rounded-2xl mb-1 border border-sf-gray-2/5"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                <Icon name={item.icon as any} size={20} color="#1E3A8A" />
              </View>
              <Text className="font-bold text-sf-text">{item.label}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              {item.value ? <Text className="text-sf-text-2 text-sm">{item.value}</Text> : null}
              <Icon name="chevron-forward" size={16} color="#AEAEB2" />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        className="flex-row items-center justify-center gap-3 p-5 bg-danger/10 rounded-2xl border border-danger/20"
      >
        <Icon name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-danger font-black text-lg">Sign Out</Text>
      </Pressable>

      <Text className="text-center text-sf-text-2 mt-10 text-xs">CropWatch AI v1.0.4 - Model Ready</Text>
    </ScrollView>
  );
}
