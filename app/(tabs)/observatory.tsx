import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { ArcaneCard } from "../../components/ui/ArcaneCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { WizardButton } from "../../components/ui/WizardButton";
import { useUserStore } from "../../store/useUserStore";

export default function Observatory() {
    const { xp, level, streak } = useUserStore();

    // Calculate XP needed for next level (simple formula: level * 100)
    const xpForNextLevel = level * 100;

    return (
        <ScrollView className="flex-1 bg-void">
            <View className="px-4 pt-12 pb-6">
                {/* Header */}
                <View className="items-center mb-8">
                    <Text className="text-starlight text-sm mb-2">Wizard Rank</Text>
                    <Text className="text-4xl font-serif text-starlight mb-4">
                        Apprentice {level}
                    </Text>
                    <ProgressBar
                        current={xp}
                        max={xpForNextLevel}
                        label="Experience"
                        color="mana"
                    />
                </View>

                {/* Daily Quest */}
                <ArcaneCard className="mb-6">
                    <Text className="text-starlight text-xl font-serif mb-2">
                        Today's Celestial Alignment
                    </Text>
                    <Text className="text-gray-400 mb-4">
                        The stars suggest you practice Substitution Spells
                    </Text>
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <ProgressBar current={0} max={5} label="Daily Progress" color="arcane" />
                        </View>
                    </View>
                </ArcaneCard>

                {/* Stats Overview */}
                <View className="flex-row gap-3 mb-6">
                    <ArcaneCard className="flex-1">
                        <Text className="text-gray-400 text-sm mb-1">Streak</Text>
                        <Text className="text-starlight text-3xl font-serif">{streak}</Text>
                        <Text className="text-gray-500 text-xs">days</Text>
                    </ArcaneCard>

                    <ArcaneCard className="flex-1">
                        <Text className="text-gray-400 text-sm mb-1">Level</Text>
                        <Text className="text-mana text-3xl font-serif">{level}</Text>
                        <Text className="text-gray-500 text-xs">rank</Text>
                    </ArcaneCard>

                    <ArcaneCard className="flex-1">
                        <Text className="text-gray-400 text-sm mb-1">XP</Text>
                        <Text className="text-arcane text-3xl font-serif">{xp}</Text>
                        <Text className="text-gray-500 text-xs">total</Text>
                    </ArcaneCard>
                </View>

                {/* Quick Actions */}
                <Text className="text-starlight text-xl font-serif mb-4">Quick Start</Text>

                <Pressable
                    onPress={() => router.push("/(tabs)/training")}
                    className="mb-3 active:opacity-80"
                >
                    <ArcaneCard>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-starlight text-lg font-serif mb-1">
                                    Training Grounds
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Practice your spellcasting
                                </Text>
                            </View>
                            <Text className="text-mana text-2xl">→</Text>
                        </View>
                    </ArcaneCard>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/(tabs)/library")}
                    className="mb-3 active:opacity-80"
                >
                    <ArcaneCard>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-starlight text-lg font-serif mb-1">
                                    Library Tower
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Study ancient texts
                                </Text>
                            </View>
                            <Text className="text-mana text-2xl">→</Text>
                        </View>
                    </ArcaneCard>
                </Pressable>

                <Pressable
                    onPress={() => router.push("/(tabs)/tome")}
                    className="mb-6 active:opacity-80"
                >
                    <ArcaneCard>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-starlight text-lg font-serif mb-1">
                                    Astral Tome
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Review your progress
                                </Text>
                            </View>
                            <Text className="text-mana text-2xl">→</Text>
                        </View>
                    </ArcaneCard>
                </Pressable>

                {/* Motivational Message */}
                <ArcaneCard className="bg-arcane/10 border-arcane/30">
                    <Text className="text-starlight text-center text-sm italic">
                        "The cosmos reveals its secrets to those who persist in their studies."
                    </Text>
                </ArcaneCard>
            </View>
        </ScrollView>
    );
}
