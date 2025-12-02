import { Text, Pressable, PressableProps, ActivityIndicator } from "react-native";

interface ButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    className?: string;
}

export function Button({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    disabled,
    ...props
}: ButtonProps) {

    const baseStyles = "rounded-xl items-center justify-center flex-row";

    const variants = {
        primary: "bg-primary active:bg-primary/90",
        secondary: "bg-secondary active:bg-secondary/80",
        outline: "bg-transparent border border-secondary active:bg-secondary/10",
        ghost: "bg-transparent active:bg-secondary/10"
    };

    const sizes = {
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-6 py-4"
    };

    const textStyles = {
        primary: "text-white font-bold",
        secondary: "text-text font-semibold",
        outline: "text-text font-medium",
        ghost: "text-text-secondary font-medium"
    };

    const sizeTextStyles = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
    };

    return (
        <Pressable
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#0F172A'} className="mr-2" />
            ) : null}
            <Text className={`${textStyles[variant]} ${sizeTextStyles[size]}`}>
                {title}
            </Text>
        </Pressable>
    );
}
