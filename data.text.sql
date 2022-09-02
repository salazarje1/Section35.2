Create Database biztime_test;

\c biztime_test;

Drop Table If Exists invoices;
Drop Table If Exists companies;

Create Table companies (
  code text Primary Key, 
  name text Not Null Unique,
  description text
);

Create Table invoices (
  id serial Primary Key,
  comp_code text Not Null REFERENCES companies On Delete Cascade,
  amt float Not Null,
  paid boolean Not Null Default false,
  add_date date Not Null Default CURRENT_DATE,
  paid_date date, 
  CONSTRAINT invoices_amt_check Check ((amt > (0)::double precision))
);