'use server';

import connectDB from "@/lib/mongodb";
import { Booking } from "@/database/booking.model";
export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    try {
        await connectDB();
        // Note: 'slug' is not in the BookingSchema, so it is omitted here to prevent it from being dropped silently by Mongoose.
        const newBooking = await Booking.create({
            eventId, email
        });

        // We cannot use `.lean()` on `Booking.create()` because it returns a Promise<Document>, not a Query.
        // Instead, we convert the rich Mongoose Document into a plain JavaScript object using JSON serialization.
        // This is strictly required because Next.js Server Actions cannot return complex objects with methods to the client.
        const booking = JSON.parse(JSON.stringify(newBooking));
        return { success: true, booking }
    } catch (e) {
        console.log("Create booking failed", e);
        return { success: false, error: "Failed to book event. Please try again" }
    }
}
