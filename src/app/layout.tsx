export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Dammaj Al-Quran - محرر فيديوهات قرآنية',
  description: 'Complete Quran Video Editing Application',
}