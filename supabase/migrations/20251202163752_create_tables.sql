create table questions (
  id uuid primary key default gen_random_uuid(),
  question text,
  options text[],
  created_at timestamp default now()
);

create table answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  options text[],
  chosen_index int,
  correct_index int,
  is_correct boolean,
  score int default 0,
  explanation text,
  created_at timestamp default now()
);
