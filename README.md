# Airline Demand & Operations Analytics Dashboard

A polished, responsive portfolio case-study website for an airline analytics project. The site presents travel demand prediction, operational turn-time analysis, real case-study screenshots, sample interactive dashboard charts, modeling results, insights, and a professional call-to-action.

This is a portfolio demo project. It does not use official airline branding or logos.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Supabase JavaScript client

## Setup

1. Create a Supabase project.
2. Create the `demo_requests` table using the SQL below.
3. Copy `.env.example` to `.env` and add your Supabase URL and anon key.
4. Install dependencies and run the site.

```bash
npm install
npm run dev
npm run build
```

Required environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Use the public Supabase anon key only. Do not use a service role key in the frontend.

## Supabase Table

Create the demo request table:

```sql
create table demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  role_title text,
  interest_area text,
  message text,
  created_at timestamp with time zone default now()
);
```

Recommended Row Level Security setup:

```sql
alter table demo_requests enable row level security;

create policy "Allow public demo request inserts"
on demo_requests
for insert
to anon
with check (true);
```

Do not add a public read policy for this table. Public visitors should be able to submit demo requests, but not read submitted requests.

### Troubleshooting Supabase 404 Errors

If the browser shows a `404` request to `/rest/v1/demo_requests`, Supabase can reach your project but cannot find the table through the REST API. Check that:

- The table is named exactly `demo_requests`.
- The table was created in the `public` schema.
- Your `.env` points to the same Supabase project where the table was created.
- The dev server was restarted after changing `.env`.

You can also reload the Supabase REST schema cache from the SQL editor:

```sql
notify pgrst, 'reload schema';
```

## Project Images

The website references screenshots from:

```text
public/project-images/
```

Image paths are used in React as browser-public paths, for example:

```jsx
"/project-images/final-results.png"
```

## Data Note

The interactive dashboard uses sample/demo data inspired by the project structure. In a production version, the sample datasets in `src/App.jsx` could be replaced with CSV parsing, a static JSON export, or an API call.
