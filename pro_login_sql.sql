create database internship; -- creating database
use internship; -- using database

create table department(
	depId int primary key,
    depName varchar(50) not null,
    location varchar(20) check(location in ('BLR', 'HYD', 'CHN', 'MUM'))
);

create table emp(
	id int primary key auto_increment,
    name varchar(20) not null,
    email varchar(50) unique,
    gender varchar(10) check (gender in ('M', 'F')),
    department int,
    salary bigint,
    company varchar(20) default 'Z',
    status varchar(20) default 'Active',
    foreign key(department) references department(depId)
);


insert into department values
(123, 'Technical consultant', 'BLR'),
(234, 'Functional consultant', 'HYD'),
(345, 'Technical Manager', 'CHN'),
(456, 'Funtional Manager', 'HYD'),
(678, 'HR Manager', 'BLR'),
(789, 'HR Recruiter', 'CHN'),
(111, 'MD', 'BLR'),
(222, 'Admin', 'BLR'),
(333, 'Sales', 'CHN');

insert into emp(name, email, gender, department, salary)
values('Employee0', 'emp0@z.com', 'M', 111, 500000),
	  ('Employee1', 'emp1@z.com', 'M', 123, 30000),
	  ('Employee2', 'emp2@z.com', 'F', 123, 28000),
      ('Employee3', 'emp3@z.com', 'M', 234, 40000),
      ('Employee4', 'emp4@z.com', 'F', 234, 37000),
      ('Employee5', 'emp5@z.com', 'F', 234, 39000),
      ('Employee6', 'emp6@z.com', 'M', 345, 190000),
      ('Employee7', 'emp7@z.com', 'M', 456, 200000),
      ('Employee8', 'emp8@z.com', 'F', 678, 90000),
      ('Employee9', 'emp9@z.com', 'F', 789, 35000),
      ('Employee10', 'emp10@z.com', 'M', 222, 15000);
      
update emp set status='inActive' where id=5;

alter table emp 
add column reporting_to int;

update emp 
set reporting_to= case department
	when 111 then null
    when 123 then 345
    when 234 then 456
	when 789 then 678
    when 345 then 111
    when 456 then 111
    when 678 then 111
    when 222 then 111
end;

select * from emp;
select * from department;

create table user(
	id int primary key auto_increment,
    email varchar(50) unique not null,
    password varchar(20) not null,
    firstName varchar(50),
    lastName varchar(50)
) auto_increment=1001;

delimiter //
create procedure registerUser(in u_email varchar(50), 
							  in u_password varchar(20), 
                              in u_firstName varchar(50), 
                              in u_lastName varchar(50),
                              out u_result int)
begin
	if exists(select 1 from user where email= u_email) then
		set u_result=1;
	else
		insert into user(email, password, firstName, lastName) values
		(u_email, u_password, u_firstname, u_lastName);
        set u_result=0;
	end if;
end //
delimiter ;

delimiter //
create procedure loginUser(in u_email varchar(50),
						   in u_password varchar(20),
                           out u_result int,
                           out u_id int)
begin
	declare p_password varchar(20);
    declare p_id int;
    
	if not exists(select 1 from user where email=u_email) then
		set u_result=1;
        set u_id=null;
	else
		select id, password into p_id, p_password
		from user where email=u_email;
        
        if cast(p_password as binary) = cast(u_password as binary) then
			set u_result=0;
            set u_id=p_id;
		else
			set u_result=2;
            set u_id=null;
		end if;
	end if;
end //
delimiter ;

delimiter //
create procedure getEmp()
begin
	select e.id as id, e.name as name, e.email as email, 
		    case
				when e.gender='M' then 'Male' 
                when e.gender='F' then 'Female'
			end as gender, 
           d.depName as department, 
           d.location as location,
           e.salary as salary,
           d1.depId as reporting_to,
           d1.depName as reportingto_text
    from emp as e
    left join department as d on d.depId=e.department
    left join department as d1 on d1.depId=e.reporting_to
    order by e.id;
end//
delimiter ;

delimiter //
create procedure forgotPassword(in u_email varchar(50),
								in u_firstName varchar(50),
                                out u_result int )
begin
	if not exists(select 1 from user where email=u_email) then
		set u_result=2;
        
	elseif not exists(select 1 from user where email=u_email and firstName=u_firstName) then
		set u_result=3;
	else
		set u_result=1;
	end if;
end //
delimiter ;

delimiter //
create procedure changePassword(in u_email varchar(50),
								in u_password varchar(50),
                                out u_result int)
begin
	update user set password=u_password where email=u_email;
    set u_result=1;
end //
delimiter ;

delimiter //
create procedure createEmp(in u_name varchar(50),
						   in u_email varchar(50),
                           in u_gender varchar(10),
                           in u_department int,
                           in u_salary bigint,
                           in u_reporting_to int,
                           out u_result int)
begin
	if exists(select 1 from emp where email=u_email) then
		set u_result=2;
	else
		insert into emp(name, email, gender, department, salary, reporting_to)
        values (u_name, u_email, u_gender, u_department, u_salary, u_reporting_to);
        set u_result=1;
	end if;
end //
delimiter ;

delimiter //
create procedure getEmpById(in u_id int)
begin
	select e.id as id,
		   e.name as name, 
		   e.email as email, 
           e.gender as gender, 
           e.department as department,
           d.location as location,
           e.salary as salary, 
           e.reporting_to as reporting_to,
           d.depName as reportingto_text
    from emp e
    left join department d on d.depId=e.reporting_to
    where e.id= u_id;
end //
delimiter ;

delimiter //
create procedure updateEmp(in u_id int,
						   in u_name varchar(50),
                           in u_gender varchar(10),
                           in u_department int,
                           in u_salary bigint,
                           in u_reporting_to int,
                           out u_result int)
begin
	if u_id is null then
		set u_result=3;
	else
		if not exists(select 1 from emp where id=u_id) then
			set u_result=2;
		else
			update emp
			set name=u_name,
				gender=u_gender,
				department=u_department,
				salary=u_salary,
				reporting_to=u_reporting_to
			where id=u_id;
			
			set u_result=1;
		end if;
	end if;
end //
delimiter ;
