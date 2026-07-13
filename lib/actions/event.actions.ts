'use server';

import connectDB from "../mongodb";
import { Event } from "@/database/event.model";

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