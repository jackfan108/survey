import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

interface SurveyResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface QuestionData {
  id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
}

interface SupabaseAnswer {
  question_id: number;
  opinion_score: number;
  importance_score: number;
  questions: QuestionData[] | QuestionData;
}

interface QuestionWithAnswer {
  question_id: number;
  question_text: string;
  label_0: string;
  label_5?: string | null;
  label_10: string;
  opinion_score?: number;
  importance_score?: number;
}

interface SurveyResultsData {
  survey: SurveyResult;
  questions: QuestionWithAnswer[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Fetch survey by email
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('email', email)
      .single();

    if (surveyError || !surveyData) {
      return NextResponse.json(
        { error: 'No survey found for this email address' },
        { status: 404 }
      );
    }

    // Fetch answers with questions
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
        )
      `)
      .eq('survey_id', surveyData.id);

    if (answersError) {
      console.error('Error fetching survey answers:', answersError);
      return NextResponse.json(
        { error: 'Error fetching survey answers' },
        { status: 500 }
      );
    }

    if (!answersData || answersData.length === 0) {
      return NextResponse.json(
        { error: 'No answers found for this survey' },
        { status: 404 }
      );
    }

    // Transform answers data
    const questions: QuestionWithAnswer[] = (answersData as SupabaseAnswer[]).map((answer) => {
      if (!answer.questions) {
        throw new Error('Invalid data structure: missing questions');
      }

      if (Array.isArray(answer.questions)) {
        if (answer.questions.length === 0) {
          throw new Error('Invalid data structure: empty questions array');
        }
        
        const question = answer.questions[0];
        return {
          question_id: answer.question_id,
          question_text: question.question_text,
          label_0: question.label_0,
          label_5: question.label_5,
          label_10: question.label_10,
          opinion_score: answer.opinion_score,
          importance_score: answer.importance_score,
        };
      } else {
        const question = answer.questions as QuestionData;
        return {
          question_id: answer.question_id,
          question_text: question.question_text,
          label_0: question.label_0,
          label_5: question.label_5,
          label_10: question.label_10,
          opinion_score: answer.opinion_score,
          importance_score: answer.importance_score,
        };
      }
    });

    const result: SurveyResultsData = {
      survey: surveyData,
      questions: questions,
    };

    return NextResponse.json({ data: result });

  } catch (err) {
    console.error('Error fetching survey results:', err);
    return NextResponse.json(
      { error: `Error fetching survey results: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}