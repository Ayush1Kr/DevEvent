'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        // Tags and agenda need to be sent as JSON strings per the API requirements
        const tagsString = formData.get('tags') as string;
        const agendaString = formData.get('agenda') as string;
        
        // Convert comma separated strings to arrays, then stringify for the FormData
        const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
        const agendaArray = agendaString.split(',').map(item => item.trim()).filter(Boolean);
        
        formData.set('tags', JSON.stringify(tagsArray));
        formData.set('agenda', JSON.stringify(agendaArray));

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Event created successfully!');
                formElement.reset();
                // Optionally redirect to home
                setTimeout(() => router.push('/'), 2000);
            } else {
                setError(data.message || data.error || 'Failed to create event');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pt-5 pb-20">
            <div className="signup-card">
                <h1 className="text-3xl font-bold mb-4 text-center">Create New Event</h1>
                
                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-2 text-sm">{error}</div>}
                {success && <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded mb-2 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Event Title</label>
                        <input type="text" name="title" required className="admin-form-input" placeholder="Next.js Conf 2026" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Description</label>
                        <textarea name="description" required className="admin-form-input h-24" placeholder="Full event description..."></textarea>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Overview (Short summary)</label>
                        <input type="text" name="overview" required className="admin-form-input" placeholder="A brief overview of the event" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Event Banner Image</label>
                        <input type="file" name="image" accept="image/*" required className="admin-form-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-light-100">Date</label>
                            <input type="date" name="date" required className="admin-form-input" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-light-100">Time</label>
                            <input type="time" name="time" required className="admin-form-input" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-light-100">Venue</label>
                            <input type="text" name="venue" required className="admin-form-input" placeholder="e.g. Moscone Center or Zoom" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-light-100">Location</label>
                            <input type="text" name="location" required className="admin-form-input" placeholder="San Francisco, CA" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-light-100">Mode</label>
                            <select name="mode" required className="admin-form-input">
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-light-100">Target Audience</label>
                            <input type="text" name="audience" required className="admin-form-input" placeholder="Developers, Designers..." />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Organizer</label>
                        <input type="text" name="organizer" required className="admin-form-input" placeholder="Company or Individual Name" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Agenda (Comma separated)</label>
                        <input type="text" name="agenda" required className="admin-form-input" placeholder="Keynote, Networking, Closing Remarks" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Tags (Comma separated)</label>
                        <input type="text" name="tags" required className="admin-form-input" placeholder="react, nextjs, web-dev" />
                    </div>

                    <button type="submit" disabled={isLoading} className="mt-4 bg-primary text-white p-3 rounded-md font-bold hover:bg-opacity-90 transition-all">
                        {isLoading ? 'Creating Event...' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}
