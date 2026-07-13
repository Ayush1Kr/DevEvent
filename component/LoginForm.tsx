'use client';

import { useState } from 'react';
import { loginAdmin } from '@/lib/actions/auth.actions';

export default function LoginForm() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await loginAdmin(formData);

        if (result.success) {
            // Refresh the page to update the server component state (which checks the cookie)
            window.location.reload();
        } else {
            setError(result.error || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full items-center justify-center pt-20">
            <div className="signup-card" style={{ maxWidth: '400px' }}>
                <h2 className="text-center mb-2">Admin Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Username</label>
                        <input type="text" name="username" required className="admin-form-input" placeholder="Enter admin username" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-light-100">Password</label>
                        <input type="password" name="password" required className="admin-form-input" placeholder="Enter your password" />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="mt-2 bg-primary text-white p-3 rounded-md hover:bg-opacity-90 transition-all font-semibold">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
