import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function SignUpScreen({ onSignUp, onLogin }: SignUpScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6">
      <div className="max-w-sm mx-auto w-full space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Pawsitive Match</h1>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary">Name</Label>
            <Input 
              id="name"
              placeholder="Enter your name"
              className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary">Email</Label>
            <Input 
              id="email"
              type="email"
              placeholder="Enter your email"
              className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary">Password</Label>
            <Input 
              id="password"
              type="password"
              placeholder="Enter your password"
              className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
            />
          </div>

          <Button 
            onClick={onSignUp}
            className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-3 rounded-2xl font-semibold"
          >
            Sign Up
          </Button>
        </form>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full py-3 rounded-2xl border-warm-gray text-primary hover:bg-warm-gray/10"
          >
            Sign up with Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full py-3 rounded-2xl border-warm-gray text-primary hover:bg-warm-gray/10"
          >
            Sign up with Facebook
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={onLogin}
            className="text-warm-gray-dark hover:text-orange-primary underline"
          >
            Already have an account? Log In
          </button>
        </div>
      </div>
    </div>
  );
}