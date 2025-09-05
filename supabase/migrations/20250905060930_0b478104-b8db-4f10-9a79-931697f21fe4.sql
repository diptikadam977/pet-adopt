-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add messages table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable realtime for conversations table
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Enable realtime for pets table 
ALTER TABLE public.pets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pets;

-- Enable realtime for adoption_requests table for notifications
ALTER TABLE public.adoption_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.adoption_requests;