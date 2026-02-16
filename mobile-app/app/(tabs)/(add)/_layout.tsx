import Stack from "expo-router/stack";

export default function AddLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Add Farm",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
