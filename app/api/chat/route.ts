import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { messages, analysisContext } = await req.json();

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const systemPrompt = `
      너는 무신사의 센스 있는 AI 패션 MD야. 
      방금 고객의 스타일을 이렇게 분석했어: ${JSON.stringify(analysisContext)}
      
      이 분석 내용을 바탕으로 고객의 질문에 답변해줘.
      말투는 친절하고 트렌디하게, 이모지를 적절히 섞어서 써줘.
      답변은 3문장 이내로 간결하게 핵심만 전달해.
      추천이 필요하면 구체적인 아이템 종류(예: 첼시 부츠, 와이드 데님)를 콕 집어서 말해줘.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });

        return NextResponse.json({
            role: 'assistant',
            content: response.choices[0].message.content
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}