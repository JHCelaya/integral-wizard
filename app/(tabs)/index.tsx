import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useUserStore } from "../../store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { RecommendationEngine } from "../../src/services/RecommendationEngine";

export default function Home() {
    const { level, xp, xpToNextLevel, streak, refreshStats } = useUserStore();
    const [recommendation, setRecommendation] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            refreshStats();
            loadRecommendations();
        }, [])
    );

    const loadRecommendations = async () => {
        const recs = await RecommendationEngine.getDailyRecommendations();
        setRecommendation(recs);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Level {level} Student</Text>
                    <ProgressBar
                        current={xp}
                        max={xpToNextLevel}
                        color="primary"
                        label="XP Progress"
                    />
                </View>

                {/* Recommended Practice */}
                <Card style={styles.recommendCard}>
                    <View style={styles.cardCenter}>
                        <Text style={styles.sectionTitle}>Recommended Practice</Text>
                        <View style={styles.iconContainer}>
                            <Ionicons name="school" size={48} color="#2563EB" />
                        </View>
                        <View style={styles.fullWidth}>
                            <Text style={styles.recommendTitle}>
                                {recommendation?.focus_area?.name || "Loading..."}
                            </Text>
                            <Text style={styles.recommendSubtitle}>
                                Mastery Level: {recommendation?.focus_area?.mastery_level || 0}
                            </Text>

                            <Button
                                title="Start Practice"
                                onPress={() => router.push({ pathname: "/(tabs)/practice", params: { categoryId: recommendation?.focus_area?.category_id } })}
                                style={styles.fullWidthButton}
                            />
                        </View>
                    </View>
                </Card>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Ionicons name="flame" size={24} color="#EF4444" />
                        <Text style={styles.statValue}>{streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="star" size={24} color="#F59E0B" />
                        <Text style={styles.statValue}>{level}</Text>
                        <Text style={styles.statLabel}>Level</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Ionicons name="flash" size={24} color="#10B981" />
                        <Text style={styles.statValue}>{xp}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </Card>
                </View>

                {/* Navigation Cards */}
                <View style={styles.navSection}>
                    <Pressable onPress={() => router.push("/(tabs)/practice")}>
                        <Card style={styles.navCard}>
                            <View style={[styles.navIcon, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                                <Ionicons name="create" size={24} color="#2563EB" />
                            </View>
                            <View>
                                <Text style={styles.navTitle}>Practice</Text>
                                <Text style={styles.navSubtitle}>Solve problems</Text>
                            </View>
                        </Card>
                    </Pressable>

                    <Pressable onPress={() => router.push("/(tabs)/lessons")}>
                        <Card style={styles.navCard}>
                            <View style={[styles.navIcon, { backgroundColor: 'rgba(147, 51, 234, 0.1)' }]}>
                                <Ionicons name="book" size={24} color="#9333EA" />
                            </View>
                            <View>
                                <Text style={styles.navTitle}>Lessons</Text>
                                <Text style={styles.navSubtitle}>Learn concepts</Text>
                            </View>
                        </Card>
                    </Pressable>

                    <Pressable onPress={() => router.push("/(tabs)/stats")}>
                        <Card style={styles.navCard}>
                            <View style={[styles.navIcon, { backgroundColor: 'rgba(217, 119, 6, 0.1)' }]}>
                                <Ionicons name="stats-chart" size={24} color="#D97706" />
                            </View>
                            <View>
                                <Text style={styles.navTitle}>Statistics</Text>
                                <Text style={styles.navSubtitle}>View progress</Text>
                            </View>
                        </Card>
                    </Pressable>
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
    header: {
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
    },
    recommendCard: {
        marginBottom: 24,
    },
    cardCenter: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 16,
    },
    iconContainer: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        padding: 16,
        borderRadius: 999,
        marginBottom: 16,
    },
    fullWidth: {
        width: '100%',
        alignItems: 'center',
    },
    recommendTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
        textAlign: 'center',
    },
    recommendSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
        textAlign: 'center',
    },
    fullWidthButton: {
        width: '100%',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#94A3B8',
    },
    navSection: {
        gap: 16,
    },
    navCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    navSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
});
