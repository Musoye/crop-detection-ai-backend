import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "../tw";
import { Icon } from "../components/icon";
import { Image } from "../tw/image";
import { getScans } from "../stores/scan-store";

interface DiagnosisResult {
  id: string;
  disease_name: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  recommendations: string[];
  image_url?: string;
  timestamp?: number;
}
type ParamsData = {
  uri?: string;
  scanId?: string;
  disease_name?: string;
  confidence?: string;
  severity?: string;
  description?: string;
  recommendations?: string;
  annotatedUrl?: string;
  detections?: string;
  totalDetections?: string;
  sourceUri?: string;
  mediaType?: string;
}

export default function ResultsScreen() {
  const params = useLocalSearchParams<ParamsData>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    loadResult();
  }, [params.scanId]);

  const loadResult = async () => {
    if (params.scanId) {
      // Logic for loading from history (already looks okay)
      try {
        const scans = await getScans();
        const scan = scans.find(s => s.id === params.scanId);
        if (scan) {
          const severity = scan.severity || (scan.healthPercentage > 80 ? "low" : scan.healthPercentage > 40 ? "medium" : "high");
          setResult({
            id: scan.id,
            disease_name: scan.disease_name || (scan.healthPercentage === 100 ? "Healthy Crop" : "Disease Detected"),
            confidence: scan.confidence || (scan.healthPercentage / 100),
            severity,
            description: scan.description || `This scan was performed on ${new Date(scan.timestamp).toLocaleString()}. It identified ${scan.totalDetections} points of interest.`,
            recommendations: scan.recommendations || (scan.healthPercentage === 100 ? ["Keep monitoring regularly", "Ensure consistent watering"] : ["Review the detailed detections", "Consider applying treatment"]),
            image_url: scan.annotatedUrl,
            timestamp: scan.timestamp
          });
        }
      } catch (error) {
        console.error("Failed to load scan result", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (params.disease_name) {
      // Fresh result passed from confirm.tsx
      setResult({
        id: "diag_" + Date.now(),
        disease_name: params.disease_name,
        confidence: parseFloat(params.confidence || "0"),
        severity: (params.severity as "low" | "medium" | "high") || "low",
        description: params.description || "",
        recommendations: JSON.parse(params.recommendations || "[]"),
        image_url: params.annotatedUrl || params.uri
      });
      setLoading(false);
      return;
    }

    // Fallback/Simulated API (for testing)
    const timer = setTimeout(() => {
      setResult({
        id: "diag_" + Date.now(),
        disease_name: "Northern Leaf Blight",
        confidence: 0.94,
        severity: "medium",
        description: "Northern corn leaf blight (NCLB) is a fungal disease that can cause significant yield loss in humid climates.",
        recommendations: [
          "Apply fungicide within 48 hours",
          "Improve field drainage",
          "Rotate crops next season"
        ],
        image_url: params.uri
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-10">
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
          <Icon name="sync-outline" size={40} color="#1E3A8A" />
        </View>
        <Text className="text-xl font-black text-sf-text mb-2">Analyzing Leaf...</Text>
        <Text className="text-sf-text-2 text-center">Our AI is diagnosticating the image for potential diseases.</Text>
      </View>
    );
  }

  const severityColor =
    result?.severity === "high" ? "#EF4444" :
      result?.severity === "medium" ? "#F59E0B" : "#10B981";

  return (
    <ScrollView
      className="flex-1 bg-sf-bg-2"
      contentContainerClassName="p-6 pb-24"
      contentInsetAdjustmentBehavior="automatic">
      <View className="flex-row items-center justify-between mb-6">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Icon name="arrow-back" size={24} color="#1E3A8A" />
        </Pressable>
        <Text className="text-xl font-black text-sf-text">Analysis Result</Text>
        <View className="w-10" />
      </View>

      {/* Hero Card */}
      <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-sf-gray-2/10">
        <View className="flex-row items-center gap-4 mb-6">
          <View className="w-16 h-16 rounded-2xl overflow-hidden bg-sf-bg-2">
            {result?.image_url && (
              <Image source={{ uri: result.image_url }} className="flex-1" contentFit="cover" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-sf-text-2 uppercase tracking-widest">Disease Identified</Text>
            <Text className="text-2xl font-black text-sf-text">{result?.disease_name}</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-sf-bg-2 p-4 rounded-2xl">
            <Text className="text-xs font-bold text-sf-text-2 mb-1 uppercase">Confidence</Text>
            <Text className="text-lg font-black text-primary">{(result!.confidence * 100).toFixed(1)}%</Text>
          </View>
          <View className="flex-1 bg-sf-bg-2 p-4 rounded-2xl">
            <Text className="text-xs font-bold text-sf-text-2 mb-1 uppercase">Severity</Text>
            <Text className="text-lg font-black capitalize" style={{ color: severityColor }}>{result?.severity}</Text>
          </View>
        </View>
      </View>

      {/* Details */}
      <View className="gap-6">
        <View>
          <Text className="text-lg font-black text-sf-text mb-2">About this disease</Text>
          <Text className="text-sf-text-2 leading-6">{result?.description}</Text>
        </View>

        <View>
          <Text className="text-lg font-black text-sf-text mb-3">Recommendations</Text>
          {result?.recommendations.map((rec, i) => (
            <View key={i} className="flex-row items-start gap-3 mb-3">
              <View className="w-6 h-6 rounded-full bg-secondary/20 items-center justify-center mt-1">
                <Icon name="checkmark" size={14} color="#10B981" />
              </View>
              <Text className="flex-1 text-sf-text leading-6">{rec}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action */}
      <View className="mt-8 gap-3">
        <Pressable
          onPress={() => router.push({ pathname: "/save-record", params: { diagId: result?.id } })}
          className="bg-primary h-16 rounded-2xl items-center justify-center shadow-lg"
        >
          <Text className="text-white text-lg font-bold">Save to Farm Record</Text>
        </Pressable>
        <Pressable
          onPress={() => router.dismissAll()}
          className="h-16 rounded-2xl items-center justify-center"
        >
          <Text className="text-sf-text-2 font-bold">Discard Result</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
