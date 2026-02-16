import { useEffect, useState } from "react";
import { PixelRatio } from "react-native";
import {
  NativeTabs,
  Icon,
  Label
} from "expo-router/unstable-native-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ImageSourcePropType } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function useTabIcon(name: IoniconsName) {
  const [source, setSource] = useState<ImageSourcePropType | null>(null);
  useEffect(() => {
    const size = 24 * PixelRatio.get();
    Ionicons.getImageSource(name, size, "#1E3A8A").then((src) => {
      if (src) setSource(src);
    });
  }, [name]);
  return source;
}

export default function TabsLayout() {
  const dashIcon = useTabIcon("grid-outline");
  const addIcon = useTabIcon("add-circle-outline");
  const historyIcon = useTabIcon("time-outline");
  const settingsIcon = useTabIcon("settings-outline");

  return (
    <NativeTabs backgroundColor="#ffffff" indicatorColor="#dbeafe">
      <NativeTabs.Trigger name="(scan)">
        <Icon
          sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }}
          androidSrc={dashIcon ?? undefined}
        />
        <Label>Dashboard</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(add)">
        <Icon
          sf={{ default: "plus.circle", selected: "plus.circle.fill" }}
          androidSrc={addIcon ?? undefined}
        />
        <Label>Add Farm</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(history)">
        <Icon
          sf={{ default: "clock", selected: "clock.fill" }}
          androidSrc={historyIcon ?? undefined}
        />
        <Label>History</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <Icon
          sf={{ default: "person", selected: "person.fill" }}
          androidSrc={settingsIcon ?? undefined}
        />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
