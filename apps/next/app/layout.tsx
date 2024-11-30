import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleHelp } from 'lucide-react'

const sfProRounded = localFont({
  src: [
    {
      path: './fonts/SF-Pro-Rounded-Ultralight.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Thin.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Heavy.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Rounded-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = {
  title: 'Anonimaxi',
  description: 'Post anonymously to Farcaster with your Moxie token.',
  openGraph: {
    title: 'Anonimaxi',
    description: 'Post anonymously to Farcaster with your Moxie token.',
    images: ['/moxie.webp'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${sfProRounded.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
        <Alert>
          <CircleHelp className="h-4 w-4" />
          <AlertTitle className="font-bold">
            Post anonymously to Farcaster
          </AlertTitle>
          <AlertDescription>
            Posts are made anonymous using zk proofs. Due to the complex calculations
            required, it could take up to a few minutes to post.
            <br />
            <br />
            <b>Requirements:</b>
            <ul>
              <li>
                - <b>1 Moxie Token</b>: Post on Farcaster
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </body>
    </html>
  )
}
