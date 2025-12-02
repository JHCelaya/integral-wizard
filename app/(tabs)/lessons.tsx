import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { dbManager } from "../../src/database/DatabaseManager";
import { Category } from "../../src/models/types";

export default function Lessons() {
    const [categories, setCategories] = useState<Category[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadCategories();
        }, [])
    );

    const loadCategories = async () => {
        const results = await dbManager.getAll('SELECT * FROM categories ORDER BY order_index ASC');
        // @ts-ignore
        setCategories(results);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.pageTitle}>Lessons</Text>

                <View style={styles.lessonList}>
                    {categories.map((cat) => (
                        <Card key={cat.id}>
                            <View style={styles.lessonHeader}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="book-outline" size={20} color="#2563EB" />
                                </View>
                                <View style={styles.lessonInfo}>
                                    <Text style={styles.lessonTitle}>{cat.display_name}</Text>
                                    <Text style={styles.lessonDescription}>
                                        {cat.description || "Master this integral technique."}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Read Lesson"
                                    size="sm"
                                    variant="outline"
                                    onPress={() => { }} // Placeholder
                                />
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 32,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 24,
    },
    lessonList: {
        gap: 16,
    },
    lessonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    lessonDescription: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
