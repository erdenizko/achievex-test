import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const searchParams = url.search;

    const fullUrl = `${process.env.ACHIEVEX_API_URL}/${path}${searchParams}`;

    try {
        const response = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': request.headers.get('x-api-key') || process.env.ACHIEVEX_DEMO_TOKEN || '',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    console.log("request-----", request);
    console.log("params-----", params);
    const path = params.path.join('/');
    const url = new URL(request.url);
    const searchParams = url.search;

    const fullUrl = `${process.env.ACHIEVEX_API_URL}/${path}${searchParams}`;

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ACHIEVEX_DEMO_TOKEN || '',
            },
            body: request.body,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 