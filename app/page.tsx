import React from 'react'
import ExploreBtn from '@/component/ExploreBtn'
import EventCard from '@/component/EventCard'
import { IEvent } from '@/database/event.model'
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const Page = async () => {
    // Next.js 15 Caching Directive:
    // Enables the new experimental caching model for this page component.
    // It caches the entire rendered output of this Server Component.
    'use cache';

    // Configures the cache duration. The 'hours' preset keeps the data 
    // fresh for a longer period (useful for slowly changing data like events).
    cacheLife('hours')

    let events = [];
    try {
        const response = await fetch(`${BASE_URL}/api/events`);
        if (response.ok) {
            const data = await response.json();
            events = data?.events || [];
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }


    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br /> Event You Can&apos;t Miss</h1>
            <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place</p>

            <ExploreBtn />

            <div className='mt-20 space-y-7'>
                <h3>Featured Events</h3>
                <ul className='events'>
                    {events && events.length > 0 && events.map((item: IEvent) => (
                        <li key={item.title} className='list-none'><EventCard {...item} /></li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
