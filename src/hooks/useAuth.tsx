
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import axiosInstance, { setToken, getToken, clearTokens } from '@/utils/axiosInstance';

interface User {
  id: string;
  username: string;
  email: string;
  address?: string;
  country?: string;
  phoneNumber?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  address?: string;
  country?: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for authenticated user on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = getToken();
        if (token) {
          // Get current user data
          const response = await axiosInstance.get('/users/me');
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            clearTokens();
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearTokens(); // Clear potentially invalid token
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        setToken(token);
        setUser(userData);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: response.data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user: newUser } = response.data.data;
        setToken(token);
        setUser(newUser);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Registration failed",
          description: response.data.message || "Could not create account",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/');
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(`/users/${user.id}`, userData);
      
      if (response.data.success) {
        const updatedUser = { ...user, ...response.data.data };
        setUser(updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
        
        return;
      } else {
        toast({
          title: "Update failed",
          description: response.data.message || "Could not update profile",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "An error occurred during update",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login,
      register,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
