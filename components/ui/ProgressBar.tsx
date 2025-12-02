import { View, Text } from "react-native";

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    color?: "primary" | "success" | "warning" | "error";
}

export function ProgressBar({
    current,
    max,
    label,
    color = "primary"
}: ProgressBarProps) {
    const percentage = Math.min((current / max) * 100, 100);

    const colorClasses = {
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
    };

    return (
        <View className="w-full">
            {label && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-text font-medium text-sm">{label}</Text>
                    <Text className="text-text-secondary text-sm">{current} / {max}</Text>
                </View>
            )}
            <View className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <View
                    className={`h-full ${colorClasses[color]} rounded-full`}
                    style={{ width: `${percentage}%` }}
                />
            </View>
        </View>
    );
}
