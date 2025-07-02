import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const url = new URL(request.url);
    console.log("path-----", path);
    console.log("request url-----", request.url);
    console.log("request x-api-key-----", request.headers.get('x-api-key'));
    const token = request.headers.get('x-api-key') || process.env.ACHIEVEX_DEMO_TOKEN || '';
    console.log("token-----", token);
    const searchParams = url.search;

    const fullUrl = `${process.env.ACHIEVEX_API_URL}/${path}${searchParams}`;

    try {
        const response = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': token,
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