
import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface PrivacySecurityScreenProps {
  onBack: () => void;
}

export function PrivacySecurityScreen({ onBack }: PrivacySecurityScreenProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    profileVisibility: true,
    contactInfoVisible: false,
    activityTracking: true,
    dataSharing: false,
    twoFactorAuth: false
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: "Your privacy setting has been saved.",
    });
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const privacySettings = [
    {
      title: 'Profile Visibility',
      description: 'Allow others to see your profile information',
      key: 'profileVisibility',
      value: settings.profileVisibility
    },
    {
      title: 'Contact Information',
      description: 'Show your contact info to other users',
      key: 'contactInfoVisible',
      value: settings.contactInfoVisible
    },
    {
      title: 'Activity Tracking',
      description: 'Allow us to track your app usage for improvements',
      key: 'activityTracking',
      value: settings.activityTracking
    },
    {
      title: 'Data Sharing',
      description: 'Share anonymized data with partners',
      key: 'dataSharing',
      value: settings.dataSharing
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Privacy & Security</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Privacy Settings */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {privacySettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-primary">{setting.title}</h4>
                  <p className="text-sm text-warm-gray-dark">{setting.description}</p>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={(value) => handleSettingChange(setting.key, value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-primary">Two-Factor Authentication</h4>
                <p className="text-sm text-warm-gray-dark">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(value) => handleSettingChange('twoFactorAuth', value)}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full justify-start rounded-xl"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            {showPasswordForm && (
              <div className="space-y-3 pt-2 border-t">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="rounded-xl"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    className="flex-1 bg-orange-primary hover:bg-orange-secondary rounded-xl"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => toast({ title: "Security Check", description: "Running security audit..." })}
              className="w-full justify-start rounded-xl"
            >
              <Key className="w-4 h-4 mr-2" />
              Security Audit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
