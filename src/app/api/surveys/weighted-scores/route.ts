import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

interface SurveyWeightedScore {
  survey_id: number;
  weighted_opinion_score: number;
}

export async function GET() {
  try {
    // Fetch all answers with their survey IDs, excluding ignored surveys
    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .select(`
        survey_id,
        opinion_score,
        importance_score,
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

    // Group answers by survey_id
    const surveyGroups = new Map<number, Array<{ survey_id: number; opinion_score: number; importance_score: number; surveys: { ignore: boolean }[] }>>();
    
    answersData.forEach((answer) => {
      if (!surveyGroups.has(answer.survey_id)) {
        surveyGroups.set(answer.survey_id, []);
      }
      surveyGroups.get(answer.survey_id)!.push(answer);
    });

    // Calculate weighted opinion score for each survey
    const surveyWeightedScores: SurveyWeightedScore[] = Array.from(surveyGroups.entries()).map(([surveyId, answers]) => {
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

      return {
        survey_id: surveyId,
        weighted_opinion_score: weightedOpinionScore,
      };
    });

    // Sort by survey_id for consistent ordering
    surveyWeightedScores.sort((a, b) => a.survey_id - b.survey_id);

    return NextResponse.json({ data: surveyWeightedScores });

  } catch (err) {
    console.error('Error fetching weighted scores:', err);
    return NextResponse.json(
      { error: `Error fetching weighted scores: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}