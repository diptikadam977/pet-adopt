import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6">
      <div className="max-w-sm mx-auto w-full space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Pawsitive Match</h1>
        </div>

        <form className="space-y-4">
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

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-warm-gray-dark underline hover:text-orange-primary"
          >
            Forgot Password?
          </button>

          <Button 
            onClick={onLogin}
            className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-3 rounded-2xl font-semibold"
          >
            Login
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={onSignUp}
            className="text-warm-gray-dark hover:text-orange-primary underline"
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="mx-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Forgot password?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-warm-gray-dark">
              Enter the email associated with your account and we'll send an email with instructions to reset your password.
            </p>
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-primary">Email</Label>
              <Input 
                id="reset-email"
                type="email"
                placeholder="Email"
                className="py-3 rounded-2xl bg-warm-gray/20 border-warm-gray"
              />
            </div>
            <Button className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-3 rounded-2xl font-semibold">
              Send recovery email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}