import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

// Type-safe dynamic route parameters for Next.js App Router
type RouteParams = {
    params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParams):Promise<NextResponse> {
    try {
        // 3. Ensure database connection
        await connectDB();
        // Await params (required in Next.js 15+)
        const { slug } = await params;

        // 1. Validation: Ensure slug is present, is a string, and isn't empty
        if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
            return NextResponse.json(
                { message: 'Invalid or missing slug parameter' },
                { status: 400 }
            );
        }

        // 2. Sanitization: trim and convert to lowercase for reliable matching
        const sanitizedSlug = slug.trim().toLowerCase();


        // 4. Query the database using .lean() for optimal read performance
        const event = await Event.findOne({ slug: sanitizedSlug }).lean();

        // 5. 404 Handling: Return Not Found if event doesn't exist
        if (!event) {
            return NextResponse.json(
                { message: `Event not found for slug: ${sanitizedSlug}` },
                { status: 404 }
            );
        }

        // Return the successfully found event
        return NextResponse.json(
            { message: 'Event fetched successfully', event },
            { status: 200 }
        );

    } catch (error) {
        // 6. Conditional logging for production readiness
        if (process.env.NODE_ENV !== 'production') {
            console.error('[GET /api/events/[slug]] Error:', error);
        }

        if(error instanceof Error) {
            if(error.message.includes('MONGODB_URL')) {
                return NextResponse.json(
                    {message:'Database configuration error'},
                    { status: 500 }
                )
            }
        }

        // Return a generic 500 status with proper type-safe error parsing
        return NextResponse.json(
            {
                message: 'Failed to fetch event',
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}
