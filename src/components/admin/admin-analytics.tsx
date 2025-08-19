
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, PawPrint, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

export function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<any>({
    userGrowth: [],
    petStats: [],
    adoptionTrends: [],
    activityData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Mock data for charts (in real app, this would come from database)
      const mockUserGrowth = [
        { month: 'Jan', users: 45, pets: 23 },
        { month: 'Feb', users: 67, pets: 35 },
        { month: 'Mar', users: 89, pets: 47 },
        { month: 'Apr', users: 123, pets: 62 },
        { month: 'May', users: 156, pets: 78 },
        { month: 'Jun', users: 189, pets: 94 }
      ];

      const mockPetStats = [
        { type: 'Dogs', count: 45, color: '#3B82F6' },
        { type: 'Cats', count: 32, color: '#EF4444' },
        { type: 'Birds', count: 18, color: '#F59E0B' },
        { type: 'Others', count: 12, color: '#10B981' }
      ];

      const mockAdoptionTrends = [
        { week: 'Week 1', adoptions: 12, applications: 28 },
        { week: 'Week 2', adoptions: 8, applications: 22 },
        { week: 'Week 3', adoptions: 15, applications: 35 },
        { week: 'Week 4', adoptions: 18, applications: 42 }
      ];

      const mockActivityData = [
        { hour: '00', activities: 5 },
        { hour: '04', activities: 2 },
        { hour: '08', activities: 25 },
        { hour: '12', activities: 45 },
        { hour: '16', activities: 38 },
        { hour: '20', activities: 22 }
      ];

      setAnalyticsData({
        userGrowth: mockUserGrowth,
        petStats: mockPetStats,
        adoptionTrends: mockAdoptionTrends,
        activityData: mockActivityData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              User & Pet Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="pets" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pet Distribution */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="w-5 h-5" />
              Pet Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.petStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {analyticsData.petStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Adoption Trends */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Adoption Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.adoptionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#F59E0B" />
                <Bar dataKey="adoptions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Daily Activity Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">89%</div>
            <div className="text-sm text-warm-gray-dark">User Retention</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <PawPrint className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">76%</div>
            <div className="text-sm text-warm-gray-dark">Adoption Rate</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">+23%</div>
            <div className="text-sm text-warm-gray-dark">Monthly Growth</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">4.2</div>
            <div className="text-sm text-warm-gray-dark">Avg Session Time</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
