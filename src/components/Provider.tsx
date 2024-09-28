'use client'

import { SessionProvider } from "next-auth/react";
import { FC } from "react";

interface ProviderProps {
    children: React.ReactNode;  
}

export const Provider: FC<ProviderProps> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
}
