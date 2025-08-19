
import React, { useState, useEffect } from 'react';
import { FileText, Check, X, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('adoption_requests')
        .select(`
          *,
          pets (
            name,
            type,
            breed,
            images
          ),
          requester:profiles!adoption_requests_requester_id_fkey (
            full_name,
            email
          ),
          owner:profiles!adoption_requests_owner_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch adoption requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Request ${status} successfully`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const filteredRequests = requests.filter(request =>
    request.pets?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requester?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requester?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Adoption Requests</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-gray-dark" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-warm-gray-dark">Pending</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {requests.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-warm-gray-dark">Approved</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-4 text-center">
            <X className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">
              {requests.filter(r => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-warm-gray-dark">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {request.pets?.images?.[0] && (
                      <img 
                        src={request.pets.images[0]} 
                        alt={request.pets.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div>
                      <h3 className="font-bold text-primary mb-1">
                        {request.pets?.name} - {request.pets?.breed}
                      </h3>
                      <p className="text-sm text-warm-gray-dark mb-2">
                        Requested by: {request.requester?.full_name || request.requester?.email}
                      </p>
                      <p className="text-sm text-warm-gray-dark mb-2">
                        Owner: {request.owner?.full_name || request.owner?.email}
                      </p>
                      {request.message && (
                        <p className="text-sm text-warm-gray-dark bg-gray-50 p-2 rounded">
                          "{request.message}"
                        </p>
                      )}
                      <p className="text-xs text-warm-gray-dark mt-2">
                        Requested on: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
