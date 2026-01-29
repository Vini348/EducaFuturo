-- Add a unique constraint to the user_id column in the user_performance table
ALTER TABLE public.user_performance
ADD CONSTRAINT user_performance_user_id_key UNIQUE (user_id);
