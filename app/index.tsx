import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = "intro" | "goal";

export default function Onboarding() {
    const [step, setStep] = useState<Step>("intro");
    const { setGoal } = useUserStore();

    useEffect(() => {
        console.log("Onboarding mounted, step:", step);
    }, [step]);

    const handleGoalSelect = (goal: "ap_calc_bc" | "calc_2" | "review") => {
        console.log("Goal selected:", goal);
        setGoal(goal);
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {step === "intro" && (
                    <View style={styles.centered}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="school" size={80} color="#2563EB" />
                        </View>

                        <Text style={styles.title}>
                            Integral Wizard
                        </Text>

                        <Text style={styles.subtitle}>
                            Master calculus through interactive practice.{"\n"}
                            <Text style={styles.highlight}>No magic, just math.</Text>
                        </Text>

                        <Button
                            title="Start Learning"
                            onPress={() => {
                                console.log("Start button pressed");
                                setStep("goal");
                            }}
                            size="lg"
                            className="w-full shadow-md"
                        />
                    </View>
                )}

                {step === "goal" && (
                    <View style={styles.fullWidth}>
                        <View style={styles.goalHeader}>
                            <Text style={styles.goalTitle}>
                                What is your goal?
                            </Text>
                            <Text style={styles.goalSubtitle}>
                                We'll tailor your practice path.
                            </Text>
                        </View>

                        <View style={styles.buttonGroup}>
                            <Button
                                title="Master AP Calculus BC"
                                variant="outline"
                                size="lg"
                                className="justify-start py-6 border-2"
                                onPress={() => handleGoalSelect("ap_calc_bc")}
                            />

                            <Button
                                title="Survive Calculus 2"
                                variant="outline"
                                size="lg"
                                className="justify-start py-6 border-2"
                                onPress={() => handleGoalSelect("calc_2")}
                            />

                            <Button
                                title="Review Calculus Concepts"
                                variant="outline"
                                size="lg"
                                className="justify-start py-6 border-2"
                                onPress={() => handleGoalSelect("review")}
                            />
                        </View>

                        <Button
                            title="Back"
                            variant="ghost"
                            onPress={() => setStep("intro")}
                            className="mt-6"
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    centered: {
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        marginBottom: 40,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        padding: 32,
        borderRadius: 999,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 24,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#64748B',
        marginBottom: 64,
        textAlign: 'center',
        lineHeight: 32,
        fontWeight: '500',
    },
    highlight: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
    fullWidth: {
        width: '100%',
    },
    goalHeader: {
        marginBottom: 48,
    },
    goalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 12,
        textAlign: 'center',
    },
    goalSubtitle: {
        color: '#64748B',
        textAlign: 'center',
        fontSize: 18,
    },
    buttonGroup: {
        gap: 16,
    },
});
