-- Create forum_attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.forum_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT forum_attachments_post_or_comment_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR 
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS forum_attachments_post_id_idx ON public.forum_attachments(post_id);
CREATE INDEX IF NOT EXISTS forum_attachments_comment_id_idx ON public.forum_attachments(comment_id);
CREATE INDEX IF NOT EXISTS forum_attachments_user_id_idx ON public.forum_attachments(user_id);

-- Enable RLS
ALTER TABLE public.forum_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all forum attachments" ON public.forum_attachments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own forum attachments" ON public.forum_attachments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum attachments" ON public.forum_attachments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum attachments" ON public.forum_attachments
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for forum attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('forum_attachments', 'forum_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload forum attachments" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'forum_attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view forum attachments" ON storage.objects
    FOR SELECT USING (bucket_id = 'forum_attachments');

CREATE POLICY "Users can delete their own forum attachments" ON storage.objects
    FOR DELETE USING (bucket_id = 'forum_attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
