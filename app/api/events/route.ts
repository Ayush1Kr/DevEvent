import {NextRequest, NextResponse} from 'next/server';
import {v2 as cloudinary}  from 'cloudinary';
import connectDB from '@/lib/mongodb'
import { Event } from '@/database';

// Configure Cloudinary using explicit env vars
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key:    process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

export async function POST(req: NextRequest) {
    try{
        // Ensure the database is connected before performing any operations
        await connectDB();

        // Parse the incoming multipart/form-data request
        const formData = await req.formData();
        const imageField = formData.get('image');

        let event;

        try{
            // Convert the form fields (title, description, venue, etc.) into a plain JavaScript object
            event = Object.fromEntries(formData.entries());
        } catch {
            return NextResponse.json({message:'Invalid JSON data format'},{status:400});
        }

        // Validate that the image field exists and is actually a File/Blob, not a text string
        if (!imageField || !(imageField instanceof Blob)) {
            return NextResponse.json(
                { message: 'Image file is required. Send it as form-data with field type "File", not Text.' },
                { status: 400 }
            );
        }

        const file = imageField as File;

        // Convert the File into a Node.js Buffer so it can be streamed to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the image to Cloudinary using a stream. Wrapped in a Promise so we can await it.
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'events',
                    upload_preset: 'nextjs-crash-course', // Matches your "Signed" preset in Cloudinary
                },
                (error, result) => {
                    if(error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        // Attach the Cloudinary secure image URL to the event object before saving to the database
        event.image = (uploadResult as {secure_url:string}).secure_url;

        // Save the complete event data into MongoDB
        const createdEvent = await Event.create(event);

        return NextResponse.json({message:'Event Successfully created',event: createdEvent},{status:201});

    } catch (e) {
        // Log the full error details to the server console and send a readable message back to the client
        console.error("FULL ERROR DETAILS:", e);
        return NextResponse.json(
            {
                message: 'Event Creation Failed.',
                error: e instanceof Error ? e.message : JSON.stringify(e)
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try{

        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({message:'Events fetched successfully', events}, {status: 200});

    } catch (e) {
        return NextResponse.json({message: 'Event fetching failed', error: e}, { status: 500 });
    }
}

// a route that accepts a slug as input-> return the event details.
