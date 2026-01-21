import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "너는 무신사의 10년차 수석 패션 컨설턴트야. 고객의 사진을 보고 스타일, 퍼스널 컬러, 체형을 분석해줘. 모든 응답은 '한국어'로 JSON 형식을 따라야 해."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `이 사람의 스타일을 분석해서 JSON으로 줘.
              
              응답 필드:
              1. style: (스타일 명)
              2. personalColor: (퍼스널 컬러 추정)
              3. bodyType: (체형 특징 추정)
              4. comment: (코멘트)
              5. searchKeywords: (무신사 검색용 아이템 키워드 3개 배열)

              { 
                style: string, 
                personalColor: string,
                bodyType: string,
                comment: string, 
                searchKeywords: string[] 
              }`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                "url": image,
                            },
                        },
                    ],
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}