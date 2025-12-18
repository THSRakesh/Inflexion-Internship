CREATE DATABASE internship; -- creating database
USE internship; -- using database

CREATE TABLE department(
	depId INT PRIMARY KEY,
    depName VARCHAR(50) NOT NULL,
    location VARCHAR(20) CHECK(location IN ('BLR', 'HYD', 'CHN', 'MUM'))
);

CREATE TABLE emp(
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE,
    gender VARCHAR(10) CHECK (gender IN ('M', 'F')),
    department INT,
    salary BIGINT,
    company VARCHAR(20) DEFAULT 'Z',
    status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY(department) REFERENCES department(depId)
);


INSERT INTO department VALUES
(123, 'Technical consultant', 'BLR'),
(234, 'Functional consultant', 'HYD'),
(345, 'Technical Manager', 'CHN'),
(456, 'Funtional Manager', 'HYD'),
(678, 'HR Manager', 'BLR'),
(789, 'HR Recruiter', 'CHN'),
(111, 'MD', 'BLR'),
(222, 'Admin', 'BLR'),
(333, 'Sales', 'CHN');

INSERT INTO emp(name, email, gender, department, salary)
VALUES('Employee0', 'emp0@z.com', 'M', 111, 500000),
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
      
UPDATE emp SET status='inActive' WHERE id=5;

ALTER TABLE emp 
ADD COLUMN reporting_to INT;

UPDATE emp 
SET reporting_to= CASE department
	WHEN 111 THEN null
    WHEN 123 THEN 345
    WHEN 234 THEN 456
	WHEN 789 THEN 678
    WHEN 345 THEN 111
    WHEN 456 THEN 111
    WHEN 678 THEN 111
    WHEN 222 THEN 111
END;

SELECT * FROM emp;
SELECT * FROM department;

CREATE TABLE project(
	id INT PRIMARY KEY,
    name VARCHAR(500),
    description VARCHAR(1000),
    type VARCHAR(50)
);

INSERT INTO project VALUES
(101, 'Employee Management System', 'A centralized application to manage employee records, roles, and reporting hierarchy. Improves HR efficiency and ensures accurate employee data.', 'Technical'),
(102, 'Salary Calculation System', 'Calculates employee salaries based on role and attendance. Reduces manual salary calculation errors.', 'Technical'),
(103, 'Leave Request Management', 'Allows employees to apply for leave online. Simplifies leave approval and tracking.', 'Functional'),
(104, 'Project Assignment Tracker', 'Tracks which employees are working on which projects. Makes project allocation simple and clear.', 'Functional');

SELECT * FROM project;


CREATE TABLE emp_project(
	emp_id INT,
    project_id INT,
    PRIMARY KEY(emp_id, project_id),
    FOREIGN KEY (emp_id) REFERENCES emp(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
);

INSERT INTO emp_project VALUES
(1, 101),
(1, 102),
(1, 103),
(1, 104);

SELECT * FROM emp_project;

CREATE TABLE user(
	id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50)
) AUTO_INCREMENT=1001;

delimiter //
CREATE PROCEDURE registerUser(IN u_email VARCHAR(50), 
							  IN u_password VARCHAR(20), 
                              IN u_firstName VARCHAR(50), 
                              IN u_lastName VARCHAR(50),
                              OUT u_result INT)
BEGIN
	IF EXISTS(SELECT 1 FROM user WHERE email= u_email) THEN
		SET u_result=1;
	ELSE
		INSERT INTO user(email, password, firstName, lastName) 
        VALUES (u_email, u_password, u_firstname, u_lastName);
        SET u_result=0;
	END IF;
END //
delimiter ;

delimiter //
CREATE PROCEDURE loginUser(IN u_email VARCHAR(50),
						   IN u_password VARCHAR(20),
                           OUT u_result INT,
                           OUT u_id INT)
BEGIN
	DECLARE p_password VARCHAR(20);
    DECLARE p_id INT;
    
	IF NOT EXISTS(SELECT 1 FROM user WHERE email=u_email) THEN
		SET u_result=1;
        SET u_id=NULL;
	ELSE
		SELECT id, password INTO p_id, p_password
		FROM user WHERE email=u_email;
        
        IF CAST(p_password AS BINARY) = CAST(u_password AS BINARY) THEN
			SET u_result=0;
            SET u_id=p_id;
		ELSE
			SET u_result=2;
            SET u_id=NULL;
		END IF;
	END IF;
END //
delimiter ;

delimiter //
CREATE PROCEDURE getEmp()
BEGIN
	SELECT e.id AS id, 
		   e.name AS name, 
           e.email AS email, 
		    CASE
				WHEN e.gender='M' THEN 'Male' 
                WHEN e.gender='F' THEN 'Female'
			END AS gender, 
           d.depName AS department, 
           d.location AS location,
           e.salary AS salary,
           d1.depId AS reporting_to,
           d1.depName AS reportingto_text,
           p.id AS project_id
    FROM emp AS e
    LEFT JOIN department AS d ON d.depId=e.department
    LEFT JOIN department AS d1 ON d1.depId=e.reporting_to
    LEFT JOIN emp_project AS e1 ON e1.emp_id=e.id
    LEFT JOIN project AS p ON p.id=e1.project_id
    ORDER BY e.id;
END//
delimiter ;

delimiter //
CREATE PROCEDURE forgotPassword(IN u_email VARCHAR(50),
								IN u_firstName VARCHAR(50),
                                OUT u_result INT )
BEGIN
	IF NOT EXISTS(SELECT 1 FROM user WHERE email=u_email) THEN
		SET u_result=2;
        
	ELSEIF NOT EXISTS(SELECT 1 FROM user WHERE email=u_email AND firstName=u_firstName) THEN
		SET u_result=3;
	ELSE
		SET u_result=1;
	END IF;
END //
delimiter ;

delimiter //
CREATE PROCEDURE changePassword(IN u_email VARCHAR(50),
								IN u_password VARCHAR(50),
                                OUT u_result INT)
BEGIN
	UPDATE user SET password=u_password WHERE email=u_email;
    SET u_result=1;
END //
delimiter ;

delimiter //
CREATE PROCEDURE getEmpById(IN u_id INT)
begin
	select e.id AS id,
		   e.name AS name, 
		   e.email AS email, 
           e.gender AS gender, 
           e.department AS department,
           d.location AS location,
           e.salary AS salary, 
           e.reporting_to AS reporting_to,
           d.depName AS reportingto_text,
           p.id AS project_id
    FROM emp e
    LEFT JOIN department AS d ON d.depId=e.reporting_to
    LEFT JOIN emp_project AS e1 ON e1.emp_id=e.id
    LEFT JOIN project AS p ON p.id=e1.project_id
    WHERE e.id= u_id;
END //
delimiter ;

delimiter //
CREATE PROCEDURE ADD_EDIT_EMPLOYEE(IN u_id INT,
								   IN u_name VARCHAR(50),
								   IN u_email VARCHAR(50),
								   IN u_gender VARCHAR(10),
								   IN u_department INT,
								   IN u_salary BIGINT,
								   IN u_reporting_to INT,
								   IN u_projects json,
								   OUT u_returnId INT,
								   OUT u_result INT)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE v_projects INT;
    DECLARE v_len INT;
	
	IF u_id IS NULL THEN   -- Insert
		IF EXISTS(SELECT 1 FROM emp WHERE email=u_email) THEN
			SET u_result=2;
		ELSE
			INSERT INTO emp(name, email, gender, department, salary, reporting_to)
			VALUES (u_name, u_email, u_gender, u_department, u_salary, u_reporting_to);
			SET u_returnId=LAST_INSERT_ID();
			
			IF u_projects IS NOT NULL THEN
				SET v_len=JSON_LENGTH(u_projects);
				WHILE i < v_len DO
					SET v_projects= JSON_UNQUOTE(JSON_EXTRACT(u_projects, CONCAT( '$[',i,']')));
					IF v_projects IS NOT NULL AND TRIM(v_projects) <> '' THEN 
						INSERT INTO emp_project(emp_id, project_id)
						VALUES(u_returnId, v_projects);
					END IF;
					SET i=i+1;
				END while;
				SET u_result=1;
			END IF;
		END IF;
	ELSE           -- Update
		if NOT EXISTS(SELECT 1 FROM emp WHERE id=u_id) THEN
			SET u_result=2;
		ELSE
			UPDATE emp
			SET name=u_name,
				gender=u_gender,
				department=u_department,
				salary=u_salary,
				reporting_to=u_reporting_to
			WHERE id=u_id;
			
            IF u_projects IS NOT NULL THEN
				DELETE FROM emp_project WHERE emp_id=u_id;
                SET v_len= JSON_LENGTH(u_projects);
				WHILE i< v_len DO
					SET v_projects = JSON_UNQUOTE(JSON_EXTRACT(u_projects, CONCAT('$[',i,']')));
                    IF v_projects IS NOT NULL AND TRIM(v_projects) <> '' THEN 
						INSERT INTO emp_project(emp_id, project_id)
						VALUES(u_id, v_projects);
					END IF;
					SET i =i+1;
				END WHILE;
                SET u_returnId=u_id;
				SET u_result=1;
			END IF;
		END IF;
	END IF;        
END //
delimiter ;
