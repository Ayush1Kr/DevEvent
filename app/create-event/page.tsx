import { Suspense } from 'react';
import { cookies } from 'next/headers';
import LoginForm from '@/component/LoginForm';
import CreateEventForm from '@/component/CreateEventForm';
import { logoutAdmin } from '@/lib/actions/auth.actions';

// Route segment configs are incompatible with cacheComponents experimental feature.
// Suspense handles the dynamic rendering requirement!

async function AdminContent() {
    // Read the secure cookie to check if the admin is authenticated
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated';

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return (
        <div className="w-full">
            <div className="flex justify-end w-full max-w-2xl mx-auto mb-4">
                <form action={logoutAdmin}>
                    <button type="submit" className="text-sm bg-dark-100 border border-dark-200 text-white px-4 py-2 rounded-md hover:bg-dark-200 transition-all card-shadow">
                        Logout
                    </button>
                </form>
            </div>
            <CreateEventForm />
        </div>
    );
}

export default function CreateEventPage() {
    return (
        <main className="min-h-screen px-4 md:px-10 py-10 flex flex-col items-center">
            <Suspense fallback={<p>Loading Admin Panel...</p>}>
                <AdminContent />
            </Suspense>
        </main>
    );
}
