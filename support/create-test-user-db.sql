
create role test with password 'test123';
ALTER ROLE "test" WITH LOGIN

create database adm_seed_test with owner test;
