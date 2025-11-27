import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0A0F1B", // void
                    borderTopColor: "#E2C88C", // starlight
                    borderTopWidth: 1,
                },
                tabBarActiveTintColor: "#E2C88C", // starlight
                tabBarInactiveTintColor: "#3F4471", // secondary
            }}
        >
            <Tabs.Screen
                name="observatory"
                options={{ title: "Observatory" }}
            />
            <Tabs.Screen
                name="library"
                options={{ title: "Library" }}
            />
            <Tabs.Screen
                name="training"
                options={{ title: "Training" }}
            />
            <Tabs.Screen
                name="tome"
                options={{ title: "Tome" }}
            />
        </Tabs>
    );
}
