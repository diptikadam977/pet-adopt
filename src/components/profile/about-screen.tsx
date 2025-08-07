
import React from 'react';
import { ArrowLeft, Info, Heart, Code, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AboutScreenProps {
  onBack: () => void;
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  const appInfo = [
    { label: 'Version', value: '1.0.0' },
    { label: 'Build', value: '2024.01.15' },
    { label: 'Platform', value: 'React Native' },
    { label: 'Database', value: 'Supabase' }
  ];

  const teamMembers = [
    { name: 'Development Team', role: 'Full Stack Development' },
    { name: 'Design Team', role: 'UI/UX Design' },
    { name: 'QA Team', role: 'Quality Assurance' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">About</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* App Info */}
        <Card className="rounded-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-orange-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-primary">PawsHomes</CardTitle>
            <p className="text-warm-gray-dark">Connecting pets with loving families</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {appInfo.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-warm-gray-dark">{item.label}</span>
                <span className="font-medium text-primary">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-warm-gray-dark leading-relaxed">
              We believe every pet deserves a loving home. Our platform connects pet owners with 
              caring adopters, making the adoption process simple, transparent, and safe for everyone involved.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Code className="w-5 h-5" />
              Development Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium text-primary">{member.name}</span>
                <span className="text-sm text-warm-gray-dark">{member.role}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact & Links */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Info className="w-5 h-5" />
              Contact & Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl"
              onClick={() => window.open('mailto:support@pawshomes.com')}
            >
              <Mail className="w-4 h-4 mr-2" />
              support@pawshomes.com
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl"
              onClick={() => window.open('https://pawshomes.com/privacy', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl"
              onClick={() => window.open('https://pawshomes.com/terms', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* Copyright */}
        <div className="text-center py-4">
          <p className="text-sm text-warm-gray-dark">
            © 2024 PawsHomes. Made with ❤️ for pets and their families.
          </p>
        </div>
      </div>
    </div>
  );
}
