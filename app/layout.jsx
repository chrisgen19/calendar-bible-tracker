import './globals.css'

export const metadata = {
  title: 'Bible Reading Calendar',
  description: 'Track your daily Bible reading progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
