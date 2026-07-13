import { notFound } from 'next/navigation';
import Image from 'next/image'
import BookEvent from '@/component/BookEvent';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import { IEvent } from '@/database';
import EventCard from '@/component/EventCard';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
    <div className='flex-row-gap-2 items-center'>
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className='flex-col-gap-2'>
        <h2>Agenda</h2>
        <ul className='list-disc pl-5'>
            {Array.isArray(agendaItems) ? agendaItems.map((item, index) => (
                <li key={index}>{item}</li>
            )) : <li>{String(agendaItems)}</li>}
        </ul>
    </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className='flex flex-row gap-1.5 flex-wrap'>
        {tags.map((tag, index) => (
            <div className='pill' key={index}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    // Next.js 15: Explicitly opt this component into the new caching semantics.
    // This tells Next.js to cache the output of this Server Component.
    'use cache'

    // Next.js 15: Define how long this cache should live. 
    // 'hours' is a preset that dictates the stale-while-revalidate duration.
    cacheLife('hours');

    const { slug } = await params;
    let event = null;
    try {
        const connectDB = (await import('@/lib/mongodb')).default;
        const { Event } = await import('@/database');
        
        await connectDB();
        const data = await Event.findOne({ slug }).lean();
        // Convert MongoDB ObjectIds to strings
        event = data ? JSON.parse(JSON.stringify(data)) : null;
    } catch (e) {
        console.error("Database fetch error:", e);
    }

    if (!event) return notFound();

    const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

    // Safely parse agenda if it was submitted as a JSON string in FormData, otherwise use it directly
    let parsedAgenda = agenda;
    if (Array.isArray(agenda) && agenda.length === 1 && typeof agenda[0] === 'string' && agenda[0].trim().startsWith('[')) {
        try { parsedAgenda = JSON.parse(agenda[0]); } catch (e) { }
    }

    // Safely parse tags if it was submitted as a JSON string in FormData, otherwise use it directly
    let parsedTags = tags;
    if (Array.isArray(tags) && tags.length === 1 && typeof tags[0] === 'string' && tags[0].trim().startsWith('[')) {
        try { parsedTags = JSON.parse(tags[0]); } catch (e) { }
    }

    const booking = 10;
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

    return (
        <section id='event'>
            <div className='header'>
                <h1>Event Description</h1>
                <p >{description}</p>
            </div>
            <div className='details'>
                {/*left side - Event content*/}
                <div className='content'>
                    <Image src={image} alt='Event Banner' width={800} height={800} className='banner' />

                    <section className='flex-col-gap-2'>
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className='flex-col-gap-2'>
                        <h2>Event Details</h2>
                        <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={date} />
                        <EventDetailItem icon='/icons/clock.svg' alt='clock' label={time} />
                        <EventDetailItem icon='/icons/pin.svg' alt='pin' label={location} />
                        <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
                        <EventDetailItem icon='/icons/audience.svg' alt='audience' label={audience} />
                    </section>

                    <EventAgenda agendaItems={parsedAgenda} />

                    <section className='flex-col-gap-2'>
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={parsedTags} />
                </div>

                {/*Right side - Booking Form*/}
                <aside className='booking'>
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {booking > 0 ? (
                            <p className="text-sm">
                                Join {booking} people who have already booked their spot!
                            </p>
                        ) : (
                            <p className="text-sm">Be the first to book the spot!</p>
                        )}

                        {/* 
                          We use event._id here instead of event.id. 
                          Why? Because the API route fetches the event using Mongoose's `.lean()` method, 
                          which returns a plain JavaScript object representing the MongoDB document. 
                          Plain MongoDB documents only have the native `_id` field; the `.id` field is a 
                          virtual getter that Mongoose only adds to full Document instances.
                        */}
                        <BookEvent eventId={event._id} slug={event.slug} />
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvents: IEvent) => (
                        /* 
                          We wrap similarEvents._id in String() because React keys must be strings or numbers. 
                          MongoDB ObjectIds (even when retrieved from the DB) are objects, 
                          so passing them directly causes a TypeScript/React warning.
                        */
                        <EventCard key={String(similarEvents._id)} {...similarEvents} />
                    ))}
                </div>
            </div>
        </section>
    )
}
export default EventDetailsPage
