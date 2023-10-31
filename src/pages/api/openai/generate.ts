import type { NextRequest } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY');
}

export const config = {
  runtime: 'edge',
};

const handler = async (req: NextRequest): Promise<Response> => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { prompt } = (await req.json()) as {
        prompt?: string;
    };

    if (!prompt) {
        return new Response('Bad Request', { status: 400 });
    }

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{
        role: 'system',
        content: 'You are a helpful assistant.'
        }, {
        role: 'user',
        content: prompt
        }],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 2048,
        stream: true,
        n: 1,
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });


    const data = res.body;
    
    return new Response(data, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
};

export default handler;
