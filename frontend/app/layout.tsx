import type { Metadata } from 'next'
import { BilingualProvider } from '@/lib/BilingualContext'
import './globals.css'

export const metadata: Metadata = {
    title: 'Aman Path | مسار أمان',
    description: 'Privacy-First, Arabic-First Recovery Support Sanctuary',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" className="dark">
            <body className="antialiased custom-scrollbar bg-[#0A0E14] text-neutral-200">
                <BilingualProvider>
                    {children}
                </BilingualProvider>
            </body>
        </html>
    )
}
