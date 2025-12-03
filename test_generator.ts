import { QuestionGenerator } from './src/services/QuestionGenerator';

console.log("--- Testing Question Generator ---");
for (let i = 0; i < 5; i++) {
    const q = QuestionGenerator.generateEasySubstitutionQuestion();
    console.log(`\nQuestion ${i + 1} (${q.meta.type}):`);
    console.log(`TeX: ${q.integrand_tex}`);
    console.log(`Sol: ${q.solution_tex}`);
}
