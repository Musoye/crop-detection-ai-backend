import AsyncStorage from "@react-native-async-storage/async-storage";

const FARMS_KEY = "farm_records";

export interface FarmRecord {
    id: string;
    name: string;
    location: string;
    size: string;
    cropType: string;
    health: "Healthy" | "Warning" | "Danger";
    timestamp: number;
}

export async function getFarms(): Promise<FarmRecord[]> {
    const data = await AsyncStorage.getItem(FARMS_KEY);
    if (!data) return [];
    const farms: FarmRecord[] = JSON.parse(data);
    return farms.sort((a, b) => b.timestamp - a.timestamp);
}

export async function saveFarm(farm: Omit<FarmRecord, "id" | "timestamp" | "health">): Promise<FarmRecord> {
    const farms = await getFarms();
    const newFarm: FarmRecord = {
        ...farm,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        timestamp: Date.now(),
        health: "Healthy", // Default health for new farms
    };

    farms.unshift(newFarm);
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(farms));
    return newFarm;
}

export async function updateFarmHealth(id: string, health: FarmRecord["health"]): Promise<void> {
    const farms = await getFarms();
    const index = farms.findIndex(f => f.id === id);
    if (index !== -1) {
        farms[index].health = health;
        await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(farms));
    }
}

export async function deleteFarm(id: string): Promise<void> {
    const farms = await getFarms();
    const filtered = farms.filter((f) => f.id !== id);
    await AsyncStorage.setItem(FARMS_KEY, JSON.stringify(filtered));
}

export async function clearFarms(): Promise<void> {
    await AsyncStorage.removeItem(FARMS_KEY);
}
