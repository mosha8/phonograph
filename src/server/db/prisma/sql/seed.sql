do $$
begin
insert into "Permission" (scope, description) 
values ('media:play', 'Allows the application to play media content.'),
  ('media:pause', 'Allows the application to pause currently playing media.'),
  ('media:stop', 'Allows the application to stop playback of media content.') on conflict do nothing;
insert into "Role" (name) values ('admin'), ('content-manager'), ('viewer') on conflict do nothing;
insert into "RolePermission" ("roleId", "permissionId") select r.id as "roleId", p.id as "permissionId" from "Role" r join "Permission" p on r.name = 'admin' and p.scope = 'media:play' on conflict do nothing;
end
$$;