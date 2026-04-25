import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'student' | 'teacher' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Initialize demo users if they don't exist
    const existingUsersRaw = localStorage.getItem('ecolearn_users');
    if (!existingUsersRaw) {
      const demoUsers = [
        {
          id: '1',
          name: 'Demo Student',
          email: 'demo@ecolearn.com',
          password: 'demo123',
          role: 'student' as Role,
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@ecolearn.com',
          password: 'john123',
          role: 'student' as Role,
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@ecolearn.com',
          password: 'jane123',
          role: 'student' as Role,
        },
        {
          id: 't1',
          name: 'Teacher Admin',
          email: 'teacher@ecolearn.com',
          password: 'teacher123',
          role: 'teacher' as Role,
        },
        {
          id: 't2',
          name: 'Mentor Teacher',
          email: 'mentor@ecolearn.com',
          password: 'mentor123',
          role: 'teacher' as Role,
        },
      ];
      localStorage.setItem('ecolearn_users', JSON.stringify(demoUsers));
    } else {
      // Migrate any existing users to ensure role exists
      try {
        const parsed = JSON.parse(existingUsersRaw || '[]');
        let updated = false;
        let migrated = parsed.map((u: any) => {
          if (!u.role) {
            updated = true;
            return { ...u, role: 'student' as Role };
          }
          return u;
        });
        // Ensure at least one teacher demo user exists
        const hasTeacher = migrated.some((u: any) => u.role === 'teacher');
        const hasTeacherEmail = (email: string) => migrated.some((u: any) => u.email === email);
        if (!hasTeacherEmail('teacher@ecolearn.com')) {
          migrated.push({ id: 't1', name: 'Teacher Admin', email: 'teacher@ecolearn.com', password: 'teacher123', role: 'teacher' as Role });
          updated = true;
        }
        if (!hasTeacherEmail('mentor@ecolearn.com')) {
          migrated.push({ id: 't2', name: 'Mentor Teacher', email: 'mentor@ecolearn.com', password: 'mentor123', role: 'teacher' as Role });
          updated = true;
        }
        if (updated) {
          localStorage.setItem('ecolearn_users', JSON.stringify(migrated));
        }
      } catch {}
    }

    const bootstrap = async () => {
      try {
        // If we have a token, prefer verifying with backend profile
        const token = localStorage.getItem('ecolearn_token');
        if (token) {
          const res = await fetch(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.success && data?.user) {
              const u = data.user;
              const mapped: User = {
                id: (u.id as string) || (u._id as string),
                name: u.name,
                email: u.email,
                role: (u.role as Role) || 'student',
              };
              setUser(mapped);
              localStorage.setItem('ecolearn_user', JSON.stringify(mapped));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch {
        // ignore and fallback
      }

      // Fallback: load any saved user from localStorage
      const savedUser = localStorage.getItem('ecolearn_user');
      if (savedUser) {
        try {
          const parsed: User = JSON.parse(savedUser);
          setUser({ ...parsed, role: (parsed.role as Role) || 'student' });
        } catch {}
      }
      setIsLoading(false);
    };

    bootstrap();
  }, [API_URL]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try backend auth first
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.token && data?.user) {
          const u = data.user;
          const mapped: User = {
            id: (u.id as string) || (u._id as string),
            name: u.name,
            email: u.email,
            role: (u.role as Role) || 'student',
          };
          setUser(mapped);
          localStorage.setItem('ecolearn_user', JSON.stringify(mapped));
          localStorage.setItem('ecolearn_token', data.token);
          setIsLoading(false);
          return true;
        }
      }
    } catch {
      // ignore and fallback
    }

    // Fallback: local demo login
    try {
      const users = JSON.parse(localStorage.getItem('ecolearn_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        const userWithoutPassword: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: (foundUser.role as Role) || 'student',
        };
        setUser(userWithoutPassword);
        localStorage.setItem('ecolearn_user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return true;
      }
    } catch {}
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try backend registration first
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.token && data?.user) {
          const u = data.user;
          const mapped: User = {
            id: (u.id as string) || (u._id as string),
            name: u.name,
            email: u.email,
            role: (u.role as Role) || 'student',
          };
          setUser(mapped);
          localStorage.setItem('ecolearn_user', JSON.stringify(mapped));
          localStorage.setItem('ecolearn_token', data.token);
          setIsLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.error('Registration error (backend):', error);
    }

    // Fallback: local demo registration
    try {
      const users = JSON.parse(localStorage.getItem('ecolearn_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      const newUser = { id: Date.now().toString(), name, email, password, role: 'student' as Role };
      users.push(newUser);
      localStorage.setItem('ecolearn_users', JSON.stringify(users));
      const userWithoutPassword: User = { id: newUser.id, name: newUser.name, email: newUser.email, role: 'student' };
      setUser(userWithoutPassword);
      localStorage.setItem('ecolearn_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error (fallback):', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecolearn_user');
    localStorage.removeItem('ecolearn_token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
