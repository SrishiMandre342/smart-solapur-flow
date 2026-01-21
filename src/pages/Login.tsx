import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Car, Shield, MapPin, AlertCircle } from 'lucide-react';
import heroCity from '@/assets/hero-city.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroCity}
          alt="Smart City"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <MapPin className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">SmartFlow Solapur</h1>
            </div>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-md">
              Intelligent Traffic & Parking Management System for a Smarter City
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <Car className="w-5 h-5 text-primary" />
                <span>Real-time parking availability</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <Shield className="w-5 h-5 text-primary" />
                <span>Traffic congestion monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/90">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Interactive city map navigation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SmartFlow Solapur</h1>
          </div>

          <Card className="shadow-xl border-border/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Role</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="citizen"
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        role === 'citizen'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="citizen" id="citizen" className="sr-only" />
                      <Car className={`w-6 h-6 mb-2 ${role === 'citizen' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${role === 'citizen' ? 'text-primary' : 'text-foreground'}`}>
                        Citizen
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">User Dashboard</span>
                    </Label>
                    <Label
                      htmlFor="admin"
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        role === 'admin'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="admin" id="admin" className="sr-only" />
                      <Shield className={`w-6 h-6 mb-2 ${role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${role === 'admin' ? 'text-primary' : 'text-foreground'}`}>
                        Admin
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">Municipal Admin</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Demo: Use any email and password to login
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
