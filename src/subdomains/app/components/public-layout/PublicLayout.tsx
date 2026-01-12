import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer onAdminClick={() => navigate('/admin')} />
    </div>
  )
}

export default PublicLayout