export const metadata = {
  title: 'cbounce.io',
  description: 'Email Verification Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
