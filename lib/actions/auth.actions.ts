'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (
        username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD
    ) {
        // Set a secure http-only cookie to remember the admin session
        const cookieStore = await cookies();
        cookieStore.set('admin_auth', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_auth');
}
