import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
    className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <View
            className={`bg-surface rounded-2xl p-4 shadow-sm border border-secondary ${className}`}
            {...props}
        >
            {children}
        </View>
    );
}
