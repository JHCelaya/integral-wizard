import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text } from "react-native";
import { useEffect, useState } from "react";
import { dbManager } from "../src/database/DatabaseManager";
import { useUserStore } from "../store/useUserStore";

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const refreshStats = useUserStore(s => s.refreshStats);

    useEffect(() => {
        console.log("=== RootLayout mounting ===");
        async function init() {
            try {
                console.log("Starting initialization...");

                // Try DB init but don't block on it
                try {
                    console.log("Attempting database init...");
                    await dbManager.init();
                    console.log("✓ Database initialized successfully");
                } catch (dbError) {
                    console.error("⚠️ Database init failed (continuing anyway):", dbError);
                }

                // Try stats refresh but don't block on it
                try {
                    console.log("Attempting to refresh stats...");
                    await refreshStats();
                    console.log("✓ Stats refreshed successfully");
                } catch (statsError) {
                    console.error("⚠️ Stats refresh failed (continuing anyway):", statsError);
                }

                console.log("✓ Initialization complete, setting ready=true");
                setReady(true);
            } catch (e) {
                console.error("❌ Fatal init error:", e);
                // Set ready anyway to show the app
                setReady(true);
            }
        }
        init();
    }, []);

    console.log(">>> RootLayout render, ready:", ready);

    if (!ready) {
        console.log(">>> Showing loading screen");
        return (
            <View style={{ flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={{ marginTop: 16, color: '#64748B', fontSize: 16 }}>Loading...</Text>
            </View>
        );
    }

    console.log(">>> Rendering main Stack");

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </View>
    );
}
