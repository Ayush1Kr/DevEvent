import React from 'react';

// loading.tsx is a special Next.js convention.
// By placing this file here, Next.js automatically wraps the page.tsx in this directory inside a React <Suspense> boundary.
// This allows the layout to render immediately while the page component streams in, preventing "blocking route" errors during dynamic fetches.
const Loading = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading event details...</p>
        </div>
    );
};

export default Loading;
