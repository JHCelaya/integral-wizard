import { View, Text, ScrollView } from "react-native";
import { ArcaneCard } from "../../components/ui/ArcaneCard";
import { WizardButton } from "../../components/ui/WizardButton";

export default function Training() {
    return (
        <ScrollView className="flex-1 bg-void">
            <View className="px-4 pt-12 pb-6">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-serif text-starlight mb-2 text-center">
                        Training Grounds
                    </Text>
                    <Text className="text-gray-400 text-center">
                        Hone your spellcasting skills
                    </Text>
                </View>

                {/* Mode Selection */}
                <ArcaneCard className="mb-6">
                    <Text className="text-starlight text-xl font-serif mb-4">
                        Choose Your Path
                    </Text>

                    <View className="gap-4">
                        <View>
                            <Text className="text-starlight text-lg font-serif mb-2">
                                Guided Spellcasting
                            </Text>
                            <Text className="text-gray-400 text-sm mb-3">
                                Step-by-step guidance through each integral. Perfect for learning new techniques.
                            </Text>
                            <WizardButton
                                title="Begin Guided Practice"
                                variant="primary"
                                onPress={() => console.log("Guided mode")}
                            />
                        </View>

                        <View className="h-px bg-starlight/20 my-2" />

                        <View>
                            <Text className="text-starlight text-lg font-serif mb-2">
                                Wizard Trial
                            </Text>
                            <Text className="text-gray-400 text-sm mb-3">
                                Test your mastery. Solve integrals independently with optional hints.
                            </Text>
                            <WizardButton
                                title="Enter the Trial"
                                variant="secondary"
                                onPress={() => console.log("Trial mode")}
                            />
                        </View>
                    </View>
                </ArcaneCard>

                {/* Difficulty Selection */}
                <ArcaneCard>
                    <Text className="text-starlight text-lg font-serif mb-3">
                        Difficulty Level
                    </Text>
                    <View className="gap-3">
                        <WizardButton
                            title="Apprentice"
                            variant="outline"
                            onPress={() => console.log("Apprentice")}
                        />
                        <WizardButton
                            title="Adept"
                            variant="outline"
                            onPress={() => console.log("Adept")}
                        />
                        <WizardButton
                            title="Archmage"
                            variant="outline"
                            onPress={() => console.log("Archmage")}
                        />
                    </View>
                </ArcaneCard>

                {/* Footer */}
                <ArcaneCard className="mt-6 bg-mana/10 border-mana/30">
                    <Text className="text-starlight text-center text-sm italic">
                        "Practice makes the spell perfect."
                    </Text>
                </ArcaneCard>
            </View>
        </ScrollView>
    );
}
