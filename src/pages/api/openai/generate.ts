import type { NextRequest } from 'next/server';

// Constants
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

    // Expanded request parameters
    const {
        prompt,
        systemMessage = 'You are a helpful assistant.', // default system message
        temperature = 0.7,
        top_p = 1,
        frequency_penalty = 0,
        presence_penalty = 0,
        max_tokens = 2048,
    } = (await req.json()) as {
        prompt?: string;
        systemMessage?: string;
        temperature?: number;
        top_p?: number;
        frequency_penalty?: number;
        presence_penalty?: number;
        max_tokens?: number;
    };

    if (!prompt) {
        return new Response('Bad Request', { status: 400 });
    }

    const payload = {
        model: 'gpt-3.5-turbo-1106',
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
        ],
        temperature,
        top_p,
        frequency_penalty,
        presence_penalty,
        max_tokens,
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

    // Return the Response
    return new Response(res.body, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
};

export default handler;
