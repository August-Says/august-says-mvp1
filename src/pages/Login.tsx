
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signIn } from '@/services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setEmailNotConfirmed(false);
    
    const { user, error, emailNotConfirmed: notConfirmed } = await signIn({ email, password });
    
    if (notConfirmed) {
      setEmailNotConfirmed(true);
    } else if (user) {
      toast.success('Successfully logged in!');
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md glass-morphism rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80">Sign in to your August Says account</p>
        </div>
        
        {emailNotConfirmed && (
          <div className="mb-6 p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-start">
            <AlertCircle className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-amber-100 text-sm">
              Your email hasn't been confirmed yet. Please check your inbox for a confirmation email or contact your administrator.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="claire@augustsays.com"
              className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-august-purple ${
                errors.email ? 'border-red-400' : ''
              }`}
            />
            {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-august-purple pr-10 ${
                  errors.password ? 'border-red-400' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-august-purple focus:ring-august-purple"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                Remember me
              </label>
            </div>
            
            <a href="#" className="text-sm text-white/80 hover:text-white">
              Forgot password?
            </a>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-august-purple hover:bg-august-purple/90 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-white/60 text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-white hover:underline">
              Contact your administrator
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
