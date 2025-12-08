import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface MathKeyboardProps {
    onInsert: (symbol: string) => void;
}

type TabType = 'numeric' | 'functions' | 'symbols' | 'greek';

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
    const [activeTab, setActiveTab] = useState<TabType>('numeric');

    const tabs = [
        { id: 'numeric' as TabType, label: '123' },
        { id: 'functions' as TabType, label: 'f( )' },
        { id: 'symbols' as TabType, label: '∞≠∈' },
        { id: 'greek' as TabType, label: 'αβγ' },
    ];

    const numericKeys = [
        [
            { label: 'x', value: 'x' },
            { label: 'y', value: 'y' },
            { label: '7', value: '7' },
            { label: '8', value: '8' },
            { label: '9', value: '9' },
            { label: '÷', value: '/' },
        ],
        [
            { label: '<', value: '<' },
            { label: '>', value: '>' },
            { label: '4', value: '4' },
            { label: '5', value: '5' },
            { label: '6', value: '6' },
            { label: '×', value: '*' },
        ],
        [
            { label: '( )', value: '()' },
            { label: '$', value: '' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '−', value: '-' },
        ],
        [
            { label: '≈', value: '≈' },
            { label: '≠', value: '!=' },
            { label: '0', value: '0' },
            { label: '.', value: '.' },
            { label: '=', value: '=' },
            { label: '+', value: '+' },
        ],
    ];

    const functionKeys = [
        [
            { label: 'sin', value: 'sin(' },
            { label: 'sin⁻¹', value: 'arcsin(' },
            { label: 'ln', value: 'ln(' },
            { label: 'e', value: 'e' },
            { label: 'lim', value: 'lim' },
            { label: '∫', value: 'int ' },
        ],
        [
            { label: 'cos', value: 'cos(' },
            { label: 'cos⁻¹', value: 'arccos(' },
            { label: 'log', value: 'log(' },
            { label: '10', value: '10' },
            { label: 'gcd', value: 'gcd(' },
            { label: 'Σ', value: 'sum' },
        ],
        [
            { label: 'tan', value: 'tan(' },
            { label: 'tan⁻¹', value: 'arctan(' },
            { label: 'log₂', value: 'log2(' },
            { label: '√', value: 'sqrt(' },
            { label: 'mod', value: 'mod' },
            { label: 'd/dx', value: 'd/dx' },
        ],
        [
            { label: 'x', value: 'x' },
            { label: '( )', value: '()' },
            { label: 'x²', value: 'x^2' },
            { label: 'xⁿ', value: 'x^' },
            { label: '', value: '' },
            { label: '', value: '' },
        ],
    ];

    const symbolKeys = [
        [
            { label: 'e', value: 'e' },
            { label: 'i', value: 'i' },
            { label: 'π', value: 'pi' },
            { label: '∞', value: 'inf' },
            { label: '∈', value: 'in' },
            { label: '∉', value: 'notin' },
        ],
        [
            { label: '²', value: '^2' },
            { label: 'ⁿ', value: '^' },
            { label: '√', value: 'sqrt(' },
            { label: 'ⁿ√', value: 'nthroot(' },
            { label: '|x|', value: 'abs(' },
            { label: '⌊x⌋', value: 'floor(' },
        ],
        [
            { label: '∫₀^∞', value: 'int_0^inf ' },
            { label: 'ₐ', value: '_' },
            { label: '/', value: '/' },
            { label: '≤', value: '<=' },
            { label: '≥', value: '>=' },
            { label: '≠', value: '!=' },
        ],
        [
            { label: '+C', value: ' + C' },
            { label: 'dx', value: 'dx' },
            { label: 'dy', value: 'dy' },
            { label: 'dt', value: 'dt' },
            { label: '', value: '' },
            { label: '', value: '' },
        ],
    ];

    const greekKeys = [
        [
            { label: 'α', value: 'alpha' },
            { label: 'β', value: 'beta' },
            { label: 'γ', value: 'gamma' },
            { label: 'δ', value: 'delta' },
            { label: 'ε', value: 'epsilon' },
            { label: 'ζ', value: 'zeta' },
        ],
        [
            { label: 'θ', value: 'theta' },
            { label: 'λ', value: 'lambda' },
            { label: 'μ', value: 'mu' },
            { label: 'π', value: 'pi' },
            { label: 'σ', value: 'sigma' },
            { label: 'φ', value: 'phi' },
        ],
        [
            { label: 'Δ', value: 'Delta' },
            { label: 'Θ', value: 'Theta' },
            { label: 'Λ', value: 'Lambda' },
            { label: 'Σ', value: 'Sigma' },
            { label: 'Φ', value: 'Phi' },
            { label: 'Ω', value: 'Omega' },
        ],
        [
            { label: '', value: '' },
            { label: '', value: '' },
            { label: '', value: '' },
            { label: '', value: '' },
            { label: '', value: '' },
            { label: '', value: '' },
        ],
    ];

    const getKeysForTab = () => {
        switch (activeTab) {
            case 'numeric': return numericKeys;
            case 'functions': return functionKeys;
            case 'symbols': return symbolKeys;
            case 'greek': return greekKeys;
            default: return numericKeys;
        }
    };

    const handleKeyPress = (value: string) => {
        if (value) {
            onInsert(value);
        }
    };

    return (
        <View style={styles.container}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <Pressable
                        key={tab.id}
                        style={[
                            styles.tab,
                            activeTab === tab.id && styles.tabActive
                        ]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab.id && styles.tabTextActive
                        ]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Keyboard Grid */}
            <View style={styles.keyboardGrid}>
                {getKeysForTab().map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keyRow}>
                        {row.map((key, keyIndex) => (
                            <Pressable
                                key={keyIndex}
                                style={({ pressed }) => [
                                    styles.key,
                                    !key.value && styles.keyEmpty,
                                    pressed && key.value && styles.keyPressed
                                ]}
                                onPress={() => handleKeyPress(key.value)}
                                disabled={!key.value}
                            >
                                <Text style={styles.keyText}>{key.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 8,
        paddingBottom: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#2563EB',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    keyboardGrid: {
        paddingHorizontal: 8,
    },
    keyRow: {
        flexDirection: 'row',
        marginBottom: 6,
        gap: 6,
    },
    key: {
        flex: 1,
        aspectRatio: 1.5,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    keyEmpty: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    keyPressed: {
        backgroundColor: '#E0E7FF',
        borderColor: '#2563EB',
    },
    keyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0F172A',
    },
});

export default MathKeyboard;
