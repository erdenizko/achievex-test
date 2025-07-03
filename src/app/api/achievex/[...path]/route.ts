import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const url = new URL(request.url);
    const token = request.headers.get('x-api-key') || process.env.ACHIEVEX_DEMO_TOKEN || '';
    const searchParams = url.search;

    const fullUrl = `${process.env.ACHIEVEX_API_URL}/${path}${searchParams}`;

    try {
        const response = await fetch(fullUrl, {
            headers: {
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
    const token = request.headers.get('x-api-key') || process.env.ACHIEVEX_DEMO_TOKEN || '';
    const body = await request.json();
    const pathJoined = path.length > 0 ? path.join('/') : '';
    const fullUrl = `${process.env.ACHIEVEX_API_URL}/${pathJoined}${searchParams}`;
    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': token,
            },
            body: JSON.stringify(body),
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