'use server';

import connectDB from "../mongodb";
import { Event } from "@/database/event.model";

// This function is exported as a Server Action. It will securely execute on the server.
// It finds events that share tags with the given event slug, excluding the event itself.
export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) return [];

        const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();

        // Convert the MongoDB documents to plain objects to avoid ObjectId type issues in React
        return JSON.parse(JSON.stringify(similarEvents));
    }
    catch {
        return [];
    }
}