'use client';

import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react"

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string }) => {

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call our Next.js Server Action directly from this Client Component.
        // This securely executes the database logic on the server without needing to create a separate API route.
        const { success, error } = await createBooking({ eventId, slug, email })

        if (success) {
            setSubmitted(true);
            // Track the successful booking event using PostHog analytics
            posthog.capture('event_booking', { event_id: eventId, slug, email });
        } else {
            console.log(error);
            // Track the error if the booking fails, passing relevant context to PostHog
            posthog.captureException(error, { event_id: eventId, slug, email });
        }

    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit} className='flex-col-gap-2'>
                    <div>
                        <label htmlFor="email" className="text-sm">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            )
            }
        </div>
    )
}

export default BookEvent