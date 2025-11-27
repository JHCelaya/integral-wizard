import { View, Text } from "react-native";

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    color?: "mana" | "arcane" | "starlight";
}

export function ProgressBar({
    current,
    max,
    label,
    color = "mana"
}: ProgressBarProps) {
    const percentage = Math.min((current / max) * 100, 100);

    const colorClasses = {
        mana: "bg-mana",
        arcane: "bg-arcane",
        starlight: "bg-starlight",
    };

    return (
        <View className="w-full">
            {label && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-starlight text-sm font-serif">{label}</Text>
                    <Text className="text-gray-400 text-sm">{current} / {max}</Text>
                </View>
            )}
            <View className="w-full h-3 bg-void/50 rounded-full overflow-hidden border border-starlight/20">
                <View
                    className={`h-full ${colorClasses[color]} rounded-full`}
                    style={{ width: `${percentage}%` }}
                />
            </View>
        </View>
    );
}
