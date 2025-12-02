import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProblemSelector } from "../../src/services/ProblemSelector";
import { Problem } from "../../src/models/types";
import MathRenderer from "../../src/components/MathRenderer";
import { ProgressTracker } from "../../src/services/ProgressTracker";

type Stage = 'config' | 'solving' | 'feedback' | 'summary';

export default function Practice() {
    const params = useLocalSearchParams();
    const initialCategoryId = params.categoryId ? Number(params.categoryId) : null;

    const [stage, setStage] = useState<Stage>('config');
    const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [setSize, setSetSize] = useState(5);

    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

    const [hintsUsed, setHintsUsed] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const [results, setResults] = useState<{ correct: number, xp: number }>({ correct: 0, xp: 0 });

    useEffect(() => {
        if (initialCategoryId) {
            setCategoryId(initialCategoryId);
        }
    }, [initialCategoryId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const startPractice = async () => {
        if (!categoryId) return;
        const probs = await ProblemSelector.getProblems(categoryId, difficulty, setSize);
        setProblems(probs);
        setCurrentIndex(0);
        setCurrentProblem(probs[0]);
        setStage('solving');
        setTimer(0);
        setIsTimerRunning(true);
        setHintsUsed(0);
        setShowSolution(false);
        setResults({ correct: 0, xp: 0 });
    };

    const handleAnswer = async (correct: boolean) => {
        setIsTimerRunning(false);
        if (!currentProblem) return;

        const { xpEarned } = await ProgressTracker.recordProblemAttempt(
            currentProblem,
            timer,
            hintsUsed,
            correct
        );

        setResults(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            xp: prev.xp + xpEarned
        }));

        if (currentIndex < problems.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentProblem(problems[nextIndex]);
            setTimer(0);
            setIsTimerRunning(true);
            setHintsUsed(0);
            setShowSolution(false);
        } else {
            setStage('summary');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (stage === 'config') {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    <Text style={styles.pageTitle}>Practice Setup</Text>

                    <Card style={styles.configCard}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <View style={styles.optionRow}>
                            {[1, 2, 3, 4, 5].map(id => (
                                <Pressable
                                    key={id}
                                    onPress={() => setCategoryId(id)}
                                    style={[
                                        styles.optionButton,
                                        categoryId === id && styles.optionButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        categoryId === id && styles.optionTextActive
                                    ]}>
                                        Category {id}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    <Card style={styles.configCard}>
                        <Text style={styles.sectionTitle}>Difficulty</Text>
                        <View style={styles.difficultyRow}>
                            {['easy', 'medium', 'hard'].map((d) => (
                                <Pressable
                                    key={d}
                                    onPress={() => setDifficulty(d as any)}
                                    style={[
                                        styles.difficultyButton,
                                        difficulty === d && styles.difficultyButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.difficultyText,
                                        difficulty === d && styles.difficultyTextActive,
                                        { textTransform: 'capitalize' }
                                    ]}>
                                        {d}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    <Button
                        title="Start Practice"
                        onPress={startPractice}
                        disabled={!categoryId}
                        style={styles.startButton}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (stage === 'solving' && currentProblem) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.solvingContainer}>
                    {/* Header */}
                    <View style={styles.solvingHeader}>
                        <Text style={styles.problemCounter}>
                            Problem {currentIndex + 1}/{problems.length}
                        </Text>
                        <View style={styles.timerContainer}>
                            <Ionicons name="time-outline" size={20} color="#64748B" />
                            <Text style={styles.timerText}>{formatTime(timer)}</Text>
                        </View>
                    </View>

                    {/* Problem Display */}
                    <Card style={styles.problemCard}>
                        <Text style={styles.problemText}>{currentProblem.problem_text}</Text>
                        <MathRenderer latex={currentProblem.problem_latex} />
                    </Card>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        {!showSolution ? (
                            <>
                                <Button
                                    title="Show Solution"
                                    onPress={() => setShowSolution(true)}
                                    style={styles.controlButton}
                                />
                                <Button
                                    title={`Hint (${hintsUsed})`}
                                    variant="outline"
                                    onPress={() => setHintsUsed(h => h + 1)}
                                />
                            </>
                        ) : (
                            <View>
                                <Text style={styles.answerPrompt}>Did you get it right?</Text>
                                <View style={styles.answerButtons}>
                                    <Button
                                        title="No"
                                        variant="outline"
                                        style={[styles.answerButton, { borderColor: '#EF4444' }]}
                                        onPress={() => handleAnswer(false)}
                                    />
                                    <Button
                                        title="Yes"
                                        variant="outline"
                                        style={[styles.answerButton, { borderColor: '#10B981' }]}
                                        onPress={() => handleAnswer(true)}
                                    />
                                </View>
                                <ScrollView style={styles.solutionScroll}>
                                    <Text style={styles.solutionText}>
                                        Solution: {JSON.parse(currentProblem.solution_steps)[0]?.latex || "..."}
                                    </Text>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (stage === 'summary') {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Practice Complete</Text>
                    <Text style={styles.summarySubtitle}>Great job!</Text>

                    <Card style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Accuracy</Text>
                            <Text style={styles.summaryValue}>
                                {Math.round(results.correct / problems.length * 100)}%
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>XP Earned</Text>
                            <Text style={styles.summaryValue}>+{results.xp}</Text>
                        </View>
                    </Card>

                    <Button
                        title="Return Home"
                        onPress={() => router.push("/(tabs)/index")}
                        style={styles.returnButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.container} />
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
    configCard: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    optionButtonActive: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '#2563EB',
    },
    optionText: {
        color: '#0F172A',
    },
    optionTextActive: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
    difficultyRow: {
        flexDirection: 'row',
        gap: 8,
    },
    difficultyButton: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    difficultyButtonActive: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '#2563EB',
    },
    difficultyText: {
        color: '#0F172A',
    },
    difficultyTextActive: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
    startButton: {
        marginTop: 16,
        width: '100%',
    },
    solvingContainer: {
        flex: 1,
        padding: 24,
    },
    solvingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    problemCounter: {
        color: '#64748B',
        fontSize: 14,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        color: '#0F172A',
        marginLeft: 8,
        fontFamily: 'monospace',
    },
    problemCard: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 24,
    },
    problemText: {
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
    },
    controlsContainer: {
        marginBottom: 32,
    },
    controlButton: {
        marginBottom: 16,
    },
    answerPrompt: {
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
    },
    answerButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    answerButton: {
        flex: 1,
    },
    solutionScroll: {
        marginTop: 16,
        maxHeight: 160,
    },
    solutionText: {
        color: '#64748B',
    },
    summaryContainer: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    summarySubtitle: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
    },
    summaryCard: {
        width: '100%',
        marginBottom: 32,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryLabel: {
        color: '#0F172A',
        fontSize: 16,
    },
    summaryValue: {
        color: '#2563EB',
        fontWeight: 'bold',
        fontSize: 16,
    },
    returnButton: {
        width: '100%',
    },
});
