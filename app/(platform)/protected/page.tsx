"use client";

import { UserButton } from "@clerk/nextjs";

const ProtectedPage = () => {
    return (
        <div>
            <UserButton afterSignOutUrl="/"/>
            <p>Protected Page</p>
        </div>
    )
}

export default ProtectedPage;