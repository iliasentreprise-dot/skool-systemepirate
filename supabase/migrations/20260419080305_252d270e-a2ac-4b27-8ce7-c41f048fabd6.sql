
-- Posts table
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Posts viewable by everyone"
  on public.posts for select using (true);

create policy "Users can create their own posts"
  on public.posts for insert with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.posts for update using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete using (auth.uid() = user_id);

create index idx_posts_created_at on public.posts (created_at desc);

-- Comments table
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Comments viewable by everyone"
  on public.comments for select using (true);

create policy "Users can create their own comments"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete using (auth.uid() = user_id);

create index idx_comments_post_id on public.comments (post_id, created_at);

-- Realtime
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.comments;

-- Storage bucket for post/comment images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Post images publicly readable"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Users can upload post images in their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own post images"
  on storage.objects for update
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own post images"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
