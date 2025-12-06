-- ------------------------------------------------------------
-- Enable pgvector extension
-- ------------------------------------------------------------
create extension if not exists vector;

alter table questions
add column if not exists embedding vector(384);

-- ------------------------------------------------------------
-- Create semantic index for embeddings
-- ------------------------------------------------------------
create index if not exists questions_embedding_idx
on questions using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

analyze questions;

-- ------------------------------------------------------------
-- RPC function: semantic duplicate detection
-- ------------------------------------------------------------
create or replace function match_questions(
  query_embedding vector(384),
  similarity_threshold float,
  match_count int
)
returns table (
  id uuid,
  question text,
  similarity float
)
language plpgsql
as $$
begin
  return query
    select
      q.id,
      q.question,
      1 - (q.embedding <=> query_embedding) as similarity
    from questions q
    where q.embedding is not null
      and 1 - (q.embedding <=> query_embedding) >= similarity_threshold
    order by q.embedding <-> query_embedding
    limit match_count;
end;
$$;