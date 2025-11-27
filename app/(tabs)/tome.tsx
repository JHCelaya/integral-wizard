import { View, Text, ScrollView } from "react-native";
import { ArcaneCard } from "../../components/ui/ArcaneCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useUserStore } from "../../store/useUserStore";

interface SkillData {
    name: string;
    proficiency: number;
    color: "mana" | "arcane" | "starlight";
}

const SKILLS: SkillData[] = [
    { name: "Substitution", proficiency: 0, color: "mana" },
    { name: "Integration by Parts", proficiency: 0, color: "arcane" },
    { name: "Trig Integrals", proficiency: 0, color: "starlight" },
    { name: "Trig Substitution", proficiency: 0, color: "mana" },
    { name: "Partial Fractions", proficiency: 0, color: "arcane" },
    { name: "Improper Integrals", proficiency: 0, color: "starlight" },
];

export default function Tome() {
    const { xp, level, streak } = useUserStore();

    return (
        <ScrollView className="flex-1 bg-void">
            <View className="px-4 pt-12 pb-6">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-serif text-starlight mb-2 text-center">
                        Astral Tome
                    </Text>
                    <Text className="text-gray-400 text-center">
                        Your journey through the arcane arts
                    </Text>
                </View>

                {/* Overall Stats */}
                <ArcaneCard className="mb-6">
                    <Text className="text-starlight text-xl font-serif mb-4">
                        Wizard Statistics
                    </Text>
                    <View className="gap-4">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400">Current Rank</Text>
                            <Text className="text-starlight font-serif text-lg">
                                Apprentice {level}
                            </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400">Total Experience</Text>
                            <Text className="text-mana font-serif text-lg">{xp} XP</Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400">Study Streak</Text>
                            <Text className="text-arcane font-serif text-lg">{streak} days</Text>
                        </View>
                    </View>
                </ArcaneCard>

                {/* Skill Proficiency */}
                <ArcaneCard className="mb-6">
                    <Text className="text-starlight text-xl font-serif mb-4">
                        Spell Mastery
                    </Text>
                    <View className="gap-4">
                        {SKILLS.map((skill) => (
                            <View key={skill.name}>
                                <ProgressBar
                                    current={skill.proficiency}
                                    max={100}
                                    label={skill.name}
                                    color={skill.color}
                                />
                            </View>
                        ))}
                    </View>
                </ArcaneCard>

                {/* Weaknesses */}
                <ArcaneCard className="bg-arcane/10 border-arcane/30">
                    <Text className="text-starlight text-lg font-serif mb-2">
                        Cosmic Insight
                    </Text>
                    <Text className="text-gray-400 text-sm italic">
                        "The stars reveal you are just beginning your journey. Continue practicing to unlock your true potential."
                    </Text>
                </ArcaneCard>
            </View>
        </ScrollView>
    );
}
