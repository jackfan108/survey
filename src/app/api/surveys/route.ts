import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface Answer {
  opinion_score?: number;
  importance_score?: number;
}

interface CreateSurveyRequest {
  userInfo: UserInfo;
  answers: Record<number, Answer>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSurveyRequest = await request.json();
    const { userInfo, answers } = body;

    if (!userInfo || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: userInfo and answers' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        message: '[DEV] Survey created successfully',
        surveyId: -1
      });
    }

    // Create survey record
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .insert([{
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email
      }])
      .select();

    if (surveyError) {
      console.error('Error creating survey:', surveyError);
      return NextResponse.json(
        { error: `Error saving survey: ${surveyError.message}` },
        { status: 500 }
      );
    }

    const surveyId = surveyData[0]?.id;
    if (!surveyId) {
      return NextResponse.json(
        { error: 'Failed to create survey' },
        { status: 500 }
      );
    }

    // Prepare answer inserts
    const answerInserts = Object.entries(answers).map(([questionId, answer]) => ({
      survey_id: surveyId,
      question_id: parseInt(questionId),
      opinion_score: answer.opinion_score,
      importance_score: answer.importance_score
    }));

    // Insert all answers
    const { error: answersError } = await supabase
      .from('answers')
      .insert(answerInserts);

    if (answersError) {
      console.error('Error saving answers:', answersError);
      return NextResponse.json(
        { error: `Error saving answers: ${answersError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Survey completed successfully',
      surveyId
    });

  } catch (err) {
    console.error('Error completing survey:', err);
    return NextResponse.json(
      { error: `Error completing survey: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}