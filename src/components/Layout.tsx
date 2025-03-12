
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');

    // If not authenticated and not on login page, redirect to login
    if (!authStatus && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const openSupportChat = () => {
    // Update to production webhook URL
    window.open('https://sonarai.app.n8n.cloud/webhook/715d27f7-f730-437c-8abe-cda82e04210e/chat', '_blank');
    toast.success("Support chat opened in a new window!");
  };

  return (
    <div className="min-h-screen flex flex-col canvas-gradient overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 canvas-gradient -z-10"></div>
      
      {/* Content */}
      {isAuthenticated && <Navbar />}
      <main className={`flex-1 ${isAuthenticated ? 'pt-16' : ''} flex flex-col`}>
        {children}
      </main>
      
      {/* Support chat button (only show when authenticated) */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button 
            onClick={openSupportChat}
            className="rounded-full w-14 h-14 bg-august-accent hover:bg-august-accent/90 text-white shadow-lg"
          >
            <MessageCircle size={24} />
          </Button>
        </div>
      )}
      
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default Layout;
