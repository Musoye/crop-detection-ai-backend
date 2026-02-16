import Stack from "expo-router/stack";

export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Crop Watch",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
