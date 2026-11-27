-- These table privileges duplicate denials already enforced by RLS.
revoke insert, update, delete, truncate, references, trigger on table
  public.admins, public.articles, public.articles_ancien, public.categories,
  public.emissions, public.publicites, public.videos, public.videos_ancien
from public, anon;

-- The public contact form keeps its INSERT privilege and existing RLS check.
revoke select, update, delete, truncate, references, trigger on table
  public.contact_messages
from public, anon;

revoke select on table public.admins from public, anon;

-- Event triggers are invoked by Postgres, independent of API execute grants.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
