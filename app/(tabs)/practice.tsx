import { View, Text, ScrollView, Pressable, StyleSheet, Alert, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Problem } from "../../src/models/types";
import MathRenderer from "../../src/components/MathRenderer";
import { PracticeService } from "../../src/services/PracticeService";
import { QuestionGenerator } from "../../src/services/QuestionGenerator";
import { useUserStore } from "../../store/useUserStore";

type Stage = 'config' | 'solving' | 'summary';

const SKILLS = [
    { id: 'SUBSTITUTION', name: 'Substitution' },
    { id: 'INTEGRATION_BY_PARTS', name: 'Integration by Parts' },
    { id: 'TRIG_INTEGRALS', name: 'Trig Integrals' },
    { id: 'TRIG_SUBSTITUTION', name: 'Trig Substitution' },
    { id: 'PARTIAL_FRACTIONS', name: 'Partial Fractions' },
    { id: 'IMPROPER_INTEGRALS', name: 'Improper Integrals' },
];

export default function Practice() {
    const params = useLocalSearchParams();
    const initialSkillId = params.skillId as string || null;
    const { refreshStats } = useUserStore();

    const [stage, setStage] = useState<Stage>('config');
    const [skillId, setSkillId] = useState<string | null>(initialSkillId);
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
    const [setSize, setSetSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('SMALL');

    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

    const [hintsUsed, setHintsUsed] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [attemptsCount, setAttemptsCount] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');

    const [results, setResults] = useState<{ correct: number, xp: number }>({ correct: 0, xp: 0 });

    useEffect(() => {
        if (initialSkillId) {
            setSkillId(initialSkillId);
        }
    }, [initialSkillId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const startPractice = async () => {
        if (!skillId) return;

        let generatedProblems: Problem[] = [];
        const count = setSize === 'SMALL' ? 3 : setSize === 'MEDIUM' ? 5 : 8;

        if (skillId === 'SUBSTITUTION') {
            // Use Generator
            for (let i = 0; i < count; i++) {
                const q = QuestionGenerator.generateEasySubstitutionQuestion();
                generatedProblems.push({
                    id: i, // Temp ID
                    category_id: 0, // Not used
                    difficulty: 'EASY', // Generator currently only does EASY
                    problem_text: "Evaluate the integral:",
                    problem_latex: q.integrand_tex,
                    solution_steps: JSON.stringify([{ latex: q.solution_tex }]),
                    hints: JSON.stringify([]),
                    base_xp: 10,
                    expected_time_seconds: 60,
                    required_techniques: JSON.stringify(['SUBSTITUTION']),
                    version: 1
                });
            }
        } else {
            // Placeholder for other skills (or fallback to empty/alert)
            Alert.alert("Coming Soon", "Generators for this skill are not ready yet. Try Substitution!");
            return;
        }

        setProblems(generatedProblems);
        console.log("Generated Problems:", JSON.stringify(generatedProblems, null, 2));
        setCurrentIndex(0);
        setCurrentProblem(generatedProblems[0]);
        setStage('solving');
        setTimer(0);
        setIsTimerRunning(true);
        setHintsUsed(0);
        setAttemptsCount(1);
        setShowSolution(false);
        setResults({ correct: 0, xp: 0 });
    };

    const handleAnswer = async (correct: boolean) => {
        setIsTimerRunning(false);
        if (!currentProblem || !skillId) return;

        // Record Attempt
        const { xpEarned } = await PracticeService.recordAttempt(
            1, // Hardcoded User ID for now
            skillId,
            difficulty, // Use selected difficulty (even if generator is easy, for now)
            correct,
            attemptsCount,
            hintsUsed,
            undefined, // templateId
            undefined, // assignmentId
            undefined  // questionId
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
            setAttemptsCount(1);
            setShowSolution(false);
            setUserAnswer('');
        } else {
            // Finish Assignment
            const bonus = await PracticeService.applyAssignmentCompletionBonus(1, skillId, setSize);
            setResults(prev => ({ ...prev, xp: prev.xp + bonus }));
            refreshStats(); // Update global stats
            setStage('summary');
        }
    };

    const handleQuit = () => {
        Alert.alert(
            "Quit Practice?",
            "You will lose progress for this assignment.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Quit",
                    style: "destructive",
                    onPress: () => {
                        setIsTimerRunning(false);
                        setStage('config');
                    }
                }
            ]
        );
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
                        <Text style={styles.sectionTitle}>Skill</Text>
                        <View style={styles.optionRow}>
                            {SKILLS.map(skill => (
                                <Pressable
                                    key={skill.id}
                                    onPress={() => setSkillId(skill.id)}
                                    style={[
                                        styles.optionButton,
                                        skillId === skill.id && styles.optionButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        skillId === skill.id && styles.optionTextActive
                                    ]}>
                                        {skill.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    <Card style={styles.configCard}>
                        <Text style={styles.sectionTitle}>Difficulty</Text>
                        <View style={styles.difficultyRow}>
                            {['EASY', 'MEDIUM', 'HARD'].map((d) => (
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
                                        {d.toLowerCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    <Card style={styles.configCard}>
                        <Text style={styles.sectionTitle}>Assignment Size</Text>
                        <View style={styles.difficultyRow}>
                            {['SMALL', 'MEDIUM', 'LARGE'].map((s) => (
                                <Pressable
                                    key={s}
                                    onPress={() => setSetSize(s as any)}
                                    style={[
                                        styles.difficultyButton,
                                        setSize === s && styles.difficultyButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.difficultyText,
                                        setSize === s && styles.difficultyTextActive,
                                        { textTransform: 'capitalize' }
                                    ]}>
                                        {s.toLowerCase()}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    <Button
                        title="Start Practice"
                        onPress={startPractice}
                        disabled={!skillId}
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
                        <Pressable onPress={handleQuit} style={styles.backButton}>
                            <Ionicons name="close" size={24} color="#64748B" />
                        </Pressable>
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

                        {/* Answer Input */}
                        <View style={styles.answerInputContainer}>
                            <Text style={styles.answerLabel}>Your Answer:</Text>
                            <TextInput
                                style={styles.answerInput}
                                value={userAnswer}
                                onChangeText={setUserAnswer}
                                placeholder="Enter your answer (e.g., x^3 + C)"
                                placeholderTextColor="#94A3B8"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </Card>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        {!showSolution ? (
                            <>
                                <Button
                                    title="Submit Answer"
                                    onPress={() => setShowSolution(true)}
                                    style={styles.controlButton}
                                    disabled={!userAnswer.trim()}
                                />
                                <Button
                                    title={`Hint (${hintsUsed})`}
                                    variant="outline"
                                    onPress={() => setHintsUsed(h => h + 1)}
                                />
                            </>
                        ) : (
                            <View>
                                <View style={styles.solutionBox}>
                                    <Text style={styles.solutionLabel}>Correct Answer:</Text>
                                    <MathRenderer
                                        latex={JSON.parse(currentProblem.solution_steps)[0]?.latex || ""}
                                        style={styles.solutionMath}
                                    />
                                </View>
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
                        title="Practice Again"
                        onPress={() => {
                            setStage('config');
                            setResults({ correct: 0, xp: 0 });
                        }}
                        style={styles.returnButton}
                    />
                    <Button
                        title="Return Home"
                        variant="outline"
                        onPress={() => router.push("/")}
                        style={[styles.returnButton, { marginTop: 12 }]}
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
        marginBottom: 8,
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
    backButton: {
        padding: 8,
        marginLeft: -8,
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
    answerInputContainer: {
        marginTop: 20,
        width: '100%',
    },
    answerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    answerInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#0F172A',
        backgroundColor: '#FFFFFF',
    },
    solutionBox: {
        backgroundColor: '#F1F5F9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    solutionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    solutionMath: {
        height: 100,
        marginTop: 8,
    },
});
