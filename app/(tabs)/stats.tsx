import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Ionicons } from "@expo/vector-icons";
import { dbManager } from "../../src/database/DatabaseManager";
import { CategoryProgress } from "../../src/models/types";

export default function Stats() {
    const [categoryProgress, setCategoryProgress] = useState<(CategoryProgress & { name: string })[]>([]);
    const [totalProblemsSolved, setTotalProblemsSolved] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const loadStats = async () => {
        const query = `
            SELECT c.name as name, c.display_name, cp.* 
            FROM categories c
            LEFT JOIN category_progress cp ON c.id = cp.category_id
        `;
        const results = await dbManager.getAll(query);
        // @ts-ignore
        setCategoryProgress(results);

        // @ts-ignore
        const total = results.reduce((acc, curr) => acc + (curr.problems_completed || 0), 0);
        setTotalProblemsSolved(total as number);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.pageTitle}>Your Statistics</Text>

                {/* Overview Cards */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{totalProblemsSolved}</Text>
                        <Text style={styles.statLabel}>Problems Solved</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>
                            {categoryProgress.filter(c => c.mastery_level >= 5).length}
                        </Text>
                        <Text style={styles.statLabel}>Mastered Skills</Text>
                    </Card>
                </View>

                {/* Category Breakdown */}
                <Text style={styles.sectionTitle}>Skill Mastery</Text>
                <View style={styles.categoryList}>
                    {categoryProgress.map((cat, index) => (
                        <Card key={index}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.categoryName}>
                                    {/* @ts-ignore */}
                                    {cat.display_name}
                                </Text>
                                <Text style={styles.categoryLevel}>
                                    Lvl {cat.mastery_level || 0}
                                </Text>
                            </View>
                            <ProgressBar
                                current={cat.total_xp || 0}
                                max={1000}
                                color="primary"
                                label={`${cat.problems_completed || 0} solved`}
                            />
                        </Card>
                    ))}
                </View>

                {/* Achievements */}
                <Text style={styles.sectionTitle}>Achievements</Text>
                <Card style={styles.achievementCard}>
                    <Ionicons name="trophy-outline" size={48} color="#94A3B8" style={{ opacity: 0.5 }} />
                    <Text style={styles.achievementText}>Coming soon...</Text>
                </Card>
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
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    statLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 16,
    },
    categoryList: {
        gap: 16,
        marginBottom: 24,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    categoryLevel: {
        fontSize: 12,
        color: '#64748B',
    },
    achievementCard: {
        alignItems: 'center',
        paddingVertical: 32,
        marginBottom: 32,
    },
    achievementText: {
        color: '#64748B',
        marginTop: 8,
    },
});
