import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

interface TagAnalysis {
  tag_id: number;
  tag_name: string;
  question_count: number;
  question_ids: number[];
  weighted_average: number;
}

interface AnswerData {
  opinion_score: number | null;
  importance_score: number | null;
}

interface QuestionData {
  id: number;
  answers: AnswerData[];
}

interface QuestionTagData {
  question_id: number;
  question: QuestionData;
}

interface TagData {
  id: number;
  name: string;
  question_tags: QuestionTagData[];
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


    // First, get the survey ID for this email
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .select('id')
      .eq('email', email)
      .single();

    if (surveyError || !surveyData) {
      return NextResponse.json(
        { error: 'No survey found for this email address' },
        { status: 404 }
      );
    }

    const surveyId = surveyData.id;

    // Get all tags with their associated questions and the specific user's answers
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        question_tags (
          question_id,
          question:questions!inner (
            id,
            answers!inner (
              opinion_score,
              importance_score
            )
          )
        )
      `)
      .eq('question_tags.question.answers.survey_id', surveyId);

    if (tagError) {
      console.error('Error fetching tag data:', tagError);
      return NextResponse.json(
        { error: 'Error fetching tag analysis data' },
        { status: 500 }
      );
    }

    if (!tagData || tagData.length === 0) {
      return NextResponse.json(
        { error: 'No tag data found' },
        { status: 404 }
      );
    }

    // Process the data to calculate weighted averages for each tag
    const tagAnalysis: TagAnalysis[] = (tagData as unknown as TagData[]).map((tag) => {
      const questionIds: number[] = [];
      let weightedSum = 0;
      let totalWeight = 0;

      tag.question_tags.forEach((qt) => {
        const question = qt.question;
        questionIds.push(question.id);
        
        // Since we filtered by survey_id, each question has exactly one answer (take first element)
        if (question.answers && question.answers.length > 0) {
          const answer = question.answers[0];
          
          if (answer.opinion_score !== null && answer.importance_score !== null) {
            weightedSum += answer.opinion_score * answer.importance_score;
            totalWeight += answer.importance_score;
          }
        }
      });

      const weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;

      return {
        tag_id: tag.id,
        tag_name: tag.name,
        question_count: questionIds.length,
        question_ids: questionIds,
        weighted_average: weightedAverage
      };
    });

    return NextResponse.json({ data: tagAnalysis });

  } catch (err) {
    console.error('Error fetching tag analysis:', err);
    return NextResponse.json(
      { error: `Error fetching tag analysis: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}