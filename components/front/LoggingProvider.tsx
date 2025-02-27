'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getClientInfo } from '@/lib/utils';

export const LoggingProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    useEffect(() => {
        const logPageView = async () => {
            try {
                const clientInfo = getClientInfo();
                
                await fetch('/api/log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clientInfo),
                });
            } catch (error) {
                console.error('Logging failed:', error);
            }
        };

        logPageView();
    }, [pathname]);

    return <>{children}</>;
};