create table questions (
  id uuid primary key default gen_random_uuid(),
  question text,
  options text[],
  correct_index int,
  created_at timestamp default now()
);

create table answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id),
  chosen_index int,
  is_correct boolean,
  explanation text,
  created_at timestamp default now()
);

create table player_score (
  id uuid primary key default gen_random_uuid(),
  correct_count int default 0,
  incorrect_count int default 0,
  updated_at timestamp default now()
);