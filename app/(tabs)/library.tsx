import { View, Text, ScrollView, Pressable } from "react-native";
import { ArcaneCard } from "../../components/ui/ArcaneCard";
import { ProgressBar } from "../../components/ui/ProgressBar";

interface LessonCategory {
    id: string;
    title: string;
    subtitle: string;
    progress: number;
    total: number;
    color: "mana" | "arcane" | "starlight";
}

const LESSON_CATEGORIES: LessonCategory[] = [
    {
        id: "basic",
        title: "Basic Incantations",
        subtitle: "Power Rule, Basic Trig",
        progress: 0,
        total: 5,
        color: "mana",
    },
    {
        id: "substitution",
        title: "Shape-Shifting Spells",
        subtitle: "U-Substitution",
        progress: 0,
        total: 8,
        color: "arcane",
    },
    {
        id: "parts",
        title: "Dual-Casting Arts",
        subtitle: "Integration by Parts",
        progress: 0,
        total: 6,
        color: "starlight",
    },
    {
        id: "trig",
        title: "Celestial Harmonics",
        subtitle: "Trig Integrals",
        progress: 0,
        total: 7,
        color: "mana",
    },
    {
        id: "trig-sub",
        title: "Astral Transformations",
        subtitle: "Trig Substitution",
        progress: 0,
        total: 5,
        color: "arcane",
    },
    {
        id: "partial",
        title: "Fragmentation Rituals",
        subtitle: "Partial Fractions",
        progress: 0,
        total: 6,
        color: "starlight",
    },
    {
        id: "improper",
        title: "Forbidden Arts",
        subtitle: "Improper Integrals",
        progress: 0,
        total: 4,
        color: "mana",
    },
];

export default function Library() {
    return (
        <ScrollView className="flex-1 bg-void">
            <View className="px-4 pt-12 pb-6">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-serif text-starlight mb-2 text-center">
                        Library Tower
                    </Text>
                    <Text className="text-gray-400 text-center">
                        Study the ancient texts of integration
                    </Text>
                </View>

                {/* Lesson Categories */}
                <View className="gap-4">
                    {LESSON_CATEGORIES.map((category) => (
                        <Pressable
                            key={category.id}
                            className="active:opacity-80"
                            onPress={() => {
                                // TODO: Navigate to lesson detail
                                console.log(`Opening ${category.id}`);
                            }}
                        >
                            <ArcaneCard>
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-1">
                                        <Text className="text-starlight text-lg font-serif mb-1">
                                            {category.title}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">
                                            {category.subtitle}
                                        </Text>
                                    </View>
                                    <View className="bg-void/50 rounded-full px-3 py-1">
                                        <Text className="text-gray-400 text-xs">
                                            {category.progress}/{category.total}
                                        </Text>
                                    </View>
                                </View>
                                <ProgressBar
                                    current={category.progress}
                                    max={category.total}
                                    color={category.color}
                                />
                            </ArcaneCard>
                        </Pressable>
                    ))}
                </View>

                {/* Footer Message */}
                <ArcaneCard className="mt-6 bg-arcane/10 border-arcane/30">
                    <Text className="text-starlight text-center text-sm italic">
                        "Knowledge is the first step to mastery."
                    </Text>
                </ArcaneCard>
            </View>
        </ScrollView>
    );
}
