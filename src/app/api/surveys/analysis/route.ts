import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

interface QuestionData {
  id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
}

interface RawAnswerData {
  question_id: number;
  opinion_score: number;
  importance_score: number;
  questions: QuestionData | QuestionData[];
  surveys: {
    ignore: boolean;
  }[];
}

interface OpinionDistribution extends Record<string | number, number> {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
}

interface ImportanceDistribution extends Record<string | number, number> {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

interface QuestionAnalysis {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  total_responses: number;
  opinion_distribution: OpinionDistribution;
  importance_distribution: ImportanceDistribution;
  opinion_std_deviation: number;
  opinion_mean: number;
  importance_mean: number;
  weighted_opinion_score: number;
}

export async function GET() {
  try {
    // Fetch all answers with their associated questions, excluding ignored surveys
    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .select(`
        question_id,
        opinion_score,
        importance_score,
        questions!inner (
          id,
          question_text,
          label_0,
          label_5,
          label_10
        ),
        surveys!inner (
          ignore
        )
      `)
      .eq('surveys.ignore', false);

    if (answersError) {
      console.error('Error fetching answers data:', answersError);
      return NextResponse.json(
        { error: 'Error fetching answers data' },
        { status: 500 }
      );
    }

    if (!answersData || answersData.length === 0) {
      return NextResponse.json(
        { error: 'No answers found' },
        { status: 404 }
      );
    }

    // Group answers by question_id
    const questionGroups = new Map<number, RawAnswerData[]>();
    
    (answersData as RawAnswerData[]).forEach((answer) => {
      if (!questionGroups.has(answer.question_id)) {
        questionGroups.set(answer.question_id, []);
      }
      questionGroups.get(answer.question_id)!.push(answer);
    });

    // Calculate distributions for each question
    const questionAnalyses: QuestionAnalysis[] = Array.from(questionGroups.entries()).map(([questionId, answers]: [number, RawAnswerData[]]) => {
      // Initialize distributions with zeros
      const opinionDistribution: OpinionDistribution = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
      };
      
      const importanceDistribution: ImportanceDistribution = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      };

      // Count occurrences of each score and collect scores for statistics
      const opinionScores: number[] = [];
      const importanceScores: number[] = [];
      
      answers.forEach((answer) => {
        if (answer.opinion_score >= 1 && answer.opinion_score <= 9) {
          opinionDistribution[answer.opinion_score as keyof OpinionDistribution]++;
          opinionScores.push(answer.opinion_score);
        }
        if (answer.importance_score >= 1 && answer.importance_score <= 5) {
          importanceDistribution[answer.importance_score as keyof ImportanceDistribution]++;
          importanceScores.push(answer.importance_score);
        }
      });

      // Calculate mean and standard deviation for opinion scores
      const opinionMean = opinionScores.length > 0 
        ? opinionScores.reduce((sum, score) => sum + score, 0) / opinionScores.length 
        : 0;
      
      const opinionVariance = opinionScores.length > 1
        ? opinionScores.reduce((sum, score) => sum + Math.pow(score - opinionMean, 2), 0) / opinionScores.length
        : 0;
      
      const opinionStdDeviation = Math.sqrt(opinionVariance);

      // Calculate mean for importance scores
      const importanceMean = importanceScores.length > 0
        ? importanceScores.reduce((sum, score) => sum + score, 0) / importanceScores.length
        : 0;

      // Calculate weighted opinion score (opinion * importance)
      let weightedSum = 0;
      let totalWeight = 0;
      
      answers.forEach((answer) => {
        if (answer.opinion_score >= 1 && answer.opinion_score <= 9 && 
            answer.importance_score >= 1 && answer.importance_score <= 5) {
          weightedSum += answer.opinion_score * answer.importance_score;
          totalWeight += answer.importance_score;
        }
      });
      
      const weightedOpinionScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

      // Get question details from first answer (all should have same question data)
      const questionData = Array.isArray(answers[0].questions) ? answers[0].questions[0] : answers[0].questions;

      return {
        question_id: questionId,
        question_text: questionData.question_text,
        label_0: questionData.label_0,
        label_5: questionData.label_5,
        label_10: questionData.label_10,
        total_responses: answers.length,
        opinion_distribution: opinionDistribution,
        importance_distribution: importanceDistribution,
        opinion_std_deviation: opinionStdDeviation,
        opinion_mean: opinionMean,
        importance_mean: importanceMean,
        weighted_opinion_score: weightedOpinionScore,
      };
    });

    // Sort by question_id for consistent ordering
    questionAnalyses.sort((a, b) => a.question_id - b.question_id);

    return NextResponse.json({ data: questionAnalyses });

  } catch (err) {
    console.error('Error fetching analysis data:', err);
    return NextResponse.json(
      { error: `Error fetching analysis data: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}