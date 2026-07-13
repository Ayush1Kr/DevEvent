import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/icons/logo.png'


// This is a Server Component by default since it has no 'use client' directive.
// It uses Next.js optimized <Link> for client-side navigation (no full page reload)
// and <Image> for automatic image optimization (lazy loading, resizing, WebP conversion).
const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href='/' className='logo'>
                    <Image src={Logo} alt='logo' width={24} height={24} />
                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href='/'>Home</Link>
                    <Link href='/'>Events</Link>
                    <Link href='/create-event'>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}
export default Navbar
