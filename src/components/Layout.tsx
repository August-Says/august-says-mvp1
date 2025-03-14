
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated with Supabase
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isLoading && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }

    // If authenticated and on login page, redirect to home
    if (!isLoading && isAuthenticated && location.pathname === '/login') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate, isLoading]);

  const openSupportChat = () => {
    // Update to production webhook URL
    window.open('https://sonarai.app.n8n.cloud/webhook/715d27f7-f730-437c-8abe-cda82e04210e/chat', '_blank');
    toast.success("Support chat opened in a new window!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#120E29] via-[#301E63] to-[#2C3494] overflow-hidden relative">
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
