import { View, Text } from "react-native";

interface ArcaneCardProps {
    children: React.ReactNode;
    className?: string;
}

export function ArcaneCard({ children, className = "" }: ArcaneCardProps) {
    return (
        <View className={`bg-parchment border border-starlight/30 rounded-2xl p-4 ${className}`}>
            {children}
        </View>
    );
}
