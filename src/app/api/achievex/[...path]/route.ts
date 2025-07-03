import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const url = new URL(request.url);
    console.log("request x-api-key-----", request.headers.get('x-api-key'));
    const token = request.headers.get('x-api-key') || process.env.ACHIEVEX_DEMO_TOKEN || '';
    console.log("token-----", token);
    console.log("process.env.ACHIEVEX_API_URL-----", process.env.ACHIEVEX_API_URL);
    const searchParams = url.search;

    const fullUrl = `${process.env.ACHIEVEX_API_URL}/${path}${searchParams}`;

    console.log("fullUrl-----", fullUrl);

    try {
        const response = await fetch(fullUrl, {
            headers: {
                'x-api-key': token,
            },
        });
        console.log("response-----", response);
        console.log("response.ok-----", response.ok);
        const data = await response.json();
        console.log("response.body-----", data);

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
    { params }: { params: Promise<{ path: string[] }> }
    ) {
    const { path } = await params;
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