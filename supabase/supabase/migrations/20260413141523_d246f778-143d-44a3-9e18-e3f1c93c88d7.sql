update public.staff
set user_id = '859c6a8e-be50-4091-bf0b-ee797e41f2a6'
where id = '5bae03a4-3533-46f0-b63f-eae3ade6ccef'
  and user_id is null;

update public.ld_staff
set user_id = '859c6a8e-be50-4091-bf0b-ee797e41f2a6'
where id = '7b241bf8-5447-43fa-ba95-6b48bb5c4505'
  and user_id is null;

insert into public.user_roles (user_id, role)
values ('859c6a8e-be50-4091-bf0b-ee797e41f2a6', 'lab_technician')
on conflict (user_id, role) do nothing;