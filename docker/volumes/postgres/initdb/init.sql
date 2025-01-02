create schema if not exists media_player_app;
create database media_player_shadow_db;
DO $$
BEGIN
   IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'db_owner') THEN

      RAISE NOTICE 'Role "db_owner" already exists. Skipping.';
   ELSE
      CREATE ROLE db_owner LOGIN PASSWORD 'postgres';
   END IF;
END $$;
alter database media_player_db owner to db_owner;
alter database media_player_db set search_path to media_player_app, public;
alter schema media_player_app owner to db_owner;
GRANT ALL PRIVILEGES ON DATABASE media_player_db TO db_owner;
GRANT ALL PRIVILEGES ON SCHEMA  media_player_app TO db_owner;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA media_player_app TO db_owner;
ALTER DEFAULT PRIVILEGES IN SCHEMA media_player_app grant ALL ON TABLES TO db_owner;
DO $$
BEGIN
   IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'media_player_app') THEN

      RAISE NOTICE 'Role "media_player_app" already exists. Skipping.';
   ELSE
      CREATE ROLE media_player_app LOGIN PASSWORD 'postgres';
   END IF;
END $$;
alter database media_player_shadow_db owner to media_player_app;
grant usage, create on schema media_player_app to media_player_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA media_player_app GRANT UPDATE, INSERT, SELECT, DELETE, REFERENCES, TRIGGER ON TABLES TO media_player_app;
revoke all on schema public from media_player_app;
revoke create on schema public from media_player_app;
