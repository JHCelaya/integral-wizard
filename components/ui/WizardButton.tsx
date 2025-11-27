import { Pressable, Text, View } from "react-native";


interface WizardButtonProps {
    onPress: () => void;
    title: string;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
}

export function WizardButton({
    onPress,
    title,
    variant = "primary",
    className
}: WizardButtonProps) {
    const baseStyles = "px-8 py-4 rounded-full items-center justify-center active:opacity-80";

    const variants = {
        primary: "bg-mana border-2 border-mana",
        secondary: "bg-arcane border-2 border-arcane",
        outline: "bg-transparent border-2 border-starlight",
    };

    const textVariants = {
        primary: "text-void font-bold text-lg font-serif",
        secondary: "text-starlight font-bold text-lg font-serif",
        outline: "text-starlight font-bold text-lg font-serif",
    };

    return (
        <Pressable
            onPress={onPress}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <Text className={textVariants[variant]}>{title}</Text>
        </Pressable>
    );
}
