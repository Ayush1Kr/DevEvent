import React from 'react'
import ExploreBtn from '@/component/ExploreBtn'
import EventCard from '@/component/EventCard'
import {events} from '@/lib/constants'



const Page = () => {
    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
            <p className='text-center mt-5'>Hackathons, Meetups and Conferences, All in One Place</p>

            <ExploreBtn/>

            <div className='mt-20 space-y-7'>
                <h3>Featured Events</h3>
                <ul className='events'>
                    {events.map((item) => (
                        <li key={item.title}><EventCard {...item}/></li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
