do $$
begin
insert into permission (scope, description) 
values ('media:play', 'Allows the application to play media content.'),
  ('media:pause', 'Allows the application to pause currently playing media.'),
  ('media:stop', 'Allows the application to stop playback of media content.') on conflict do nothing;
insert into role (name) values ('admin'), ('content-manager'), ('viewer') on conflict do nothing;
insert into role_permission (role_id, permission_id) select role.id as role_id, permission.id as permission_id from media_player_app.role join media_player_app.permission on role.name = 'admin' and permission.scope = 'media:play' on conflict do nothing;
end
$$;