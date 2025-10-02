import './globals.css'
import { AuthProvider } from './context/AuthContext'

export const metadata = {
  title: 'Bible Reading Calendar',
  description: 'Track your daily Bible reading progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
