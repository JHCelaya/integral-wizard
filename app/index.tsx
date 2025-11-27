import { View, Text } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { WizardButton } from "../components/ui/WizardButton";
import { useUserStore } from "../store/useUserStore";

type Step = "intro" | "avatar" | "goal";

export default function Onboarding() {
    const [step, setStep] = useState<Step>("intro");
    const { setAvatarColor, setGoal } = useUserStore();

    const handleAvatarSelect = (color: "red" | "blue" | "green") => {
        setAvatarColor(color);
        setStep("goal");
    };

    const handleGoalSelect = (goal: "ap_calc_bc" | "calc_2" | "review") => {
        setGoal(goal);
        router.replace("/(tabs)/observatory");
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0A0F1B', padding: 16, justifyContent: 'center' }}>
            {step === "intro" && (
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#E2C88C', marginBottom: 16, textAlign: 'center' }}>
                        The Awakening
                    </Text>
                    <Text style={{ fontSize: 18, color: '#9CA3AF', marginBottom: 48, textAlign: 'center', lineHeight: 28 }}>
                        You awaken in the Astral Academy, a place where mana and mathematics intertwine.
                        Your journey to master the Arcane Integrals begins now.
                    </Text>
                    <WizardButton
                        title="Open Your Eyes"
                        onPress={() => setStep("avatar")}
                    />
                </View>
            )}

            {step === "avatar" && (
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#E2C88C', marginBottom: 32, textAlign: 'center' }}>
                        Choose Your Robes
                    </Text>
                    <View style={{ width: '100%', gap: 16 }}>
                        <WizardButton
                            title="Crimson Pyromancer"
                            variant="outline"
                            onPress={() => handleAvatarSelect("red")}
                        />
                        <WizardButton
                            title="Azure Hydromancer"
                            variant="outline"
                            onPress={() => handleAvatarSelect("blue")}
                        />
                        <WizardButton
                            title="Emerald Geomancer"
                            variant="outline"
                            onPress={() => handleAvatarSelect("green")}
                        />
                    </View>
                </View>
            )}

            {step === "goal" && (
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#E2C88C', marginBottom: 32, textAlign: 'center' }}>
                        What do you seek?
                    </Text>
                    <View style={{ width: '100%', gap: 16 }}>
                        <WizardButton
                            title="Master AP Calculus BC"
                            variant="secondary"
                            onPress={() => handleGoalSelect("ap_calc_bc")}
                        />
                        <WizardButton
                            title="Survive Calculus 2"
                            variant="secondary"
                            onPress={() => handleGoalSelect("calc_2")}
                        />
                        <WizardButton
                            title="Review Ancient Arts"
                            variant="secondary"
                            onPress={() => handleGoalSelect("review")}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}
