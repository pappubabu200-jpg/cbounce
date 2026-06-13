import './globals.css'

export const metadata = {
  title: 'cbounce.io',
  description: 'Email Verification Platform',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
