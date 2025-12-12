package com.example.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.DAO.ResponseDAO;
import com.example.DAO.UserDAO;
import com.example.entity.Employee;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;

@Service
public class UserServiceImpl implements UserService{

    @PersistenceContext
    EntityManager entityManager;
    
    public ResponseEntity<?> registerUser(UserDAO userDAO){

        if(userDAO.getEmail()== null || userDAO.getEmail().trim().isEmpty()){
            return ResponseEntity.status(400).body("Email Cannot be Empty");
        }
        
        if(userDAO.getPassword()== null || userDAO.getPassword().trim().isEmpty()){
            return ResponseEntity.status(400).body("Password Cannot be Empty");
        }

        if(userDAO.getFirstName()== null || userDAO.getFirstName().trim().isEmpty()){
            return ResponseEntity.status(400).body("First Name Cannot be Empty");
        }

        if(userDAO.getLastName()== null || userDAO.getLastName().trim().isEmpty()){
            return ResponseEntity.status(400).body("Last Name Cannot be Empty");
        }
        
        if(!userDAO.getPassword().equals(userDAO.getConfirmPassword())){
            return ResponseEntity.status(400).body("Password and confirm password not matched");
        }

        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("registerUser");
        query.registerStoredProcedureParameter("u_email", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_password", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_firstName", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_lastName", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_result", Integer.class, ParameterMode.OUT);


        userDAO.setEmail(userDAO.getEmail().trim());
        userDAO.setPassword(userDAO.getPassword().trim());
        userDAO.setFirstName(userDAO.getFirstName().trim());
        userDAO.setLastName(userDAO.getLastName().trim());

        query.setParameter("u_email", userDAO.getEmail());
        query.setParameter("u_password", userDAO.getPassword());
        query.setParameter("u_firstName", userDAO.getFirstName());
        query.setParameter("u_lastName", userDAO.getLastName());

        query.execute();

        Integer result=(Integer)query.getOutputParameterValue("u_result");
        if(result ==1){
            return ResponseEntity.status(409).body("Email already Exists");
        }
        else{
            return ResponseEntity.ok("Registered Successfully");
        }
    }

    public ResponseEntity<?> loginUser(UserDAO userDAO){
        
        if(userDAO.getEmail()== null || userDAO.getEmail().trim().isEmpty()){
            return ResponseEntity.status(400).body("Email Cannot be Empty");
        }

        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("loginUser");
        query.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(2, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(3, Integer.class, ParameterMode.OUT);
        query.registerStoredProcedureParameter(4, Integer.class, ParameterMode.OUT);
        
        userDAO.setEmail(userDAO.getEmail().trim());
        userDAO.setPassword(userDAO.getPassword().trim());

        query.setParameter(1, userDAO.getEmail());
        query.setParameter(2, userDAO.getPassword());

        query.execute();

        Integer result=(Integer)query.getOutputParameterValue(3);
        Integer id=(Integer)query.getOutputParameterValue(4);

        if(result == 0){
            System.out.println("Success");
            ResponseDAO response=new ResponseDAO("Login Success", id);
            System.out.println(response.getUserId());
            return ResponseEntity.ok(response);
        }
        else if(result == 1){
            System.out.println("Email not registered");
            return ResponseEntity.status(404).body("Email is not registered");
        }
        else{
            System.out.println("Password mismatch");
            return ResponseEntity.status(401).body("Password mismatch");
        }
    }

    public List<Employee>getEmpData(){
        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("getEmp","Employee_Data");
        return query.getResultList();
    }

    public ResponseEntity<?> forgotPassword(UserDAO userDAO){
        if(userDAO.getEmail() == null || userDAO.getEmail().trim().isEmpty()){
            return ResponseEntity.status(400).body("Email cannot be Empty");
        }
        if(userDAO.getFirstName() == null || userDAO.getFirstName().trim().isEmpty()){
            return ResponseEntity.status(400).body("First cannot be Empty");
        }

        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("forgotPassword");
        query.registerStoredProcedureParameter("u_email", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_firstName", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_result", Integer.class, ParameterMode.OUT);

        userDAO.setEmail(userDAO.getEmail().trim());
        userDAO.setFirstName(userDAO.getFirstName().trim());

        query.setParameter("u_email", userDAO.getEmail());
        query.setParameter("u_firstName", userDAO.getFirstName());
        query.execute();

        Integer result=(Integer)query.getOutputParameterValue("u_result");
        if(result==2){
            System.out.println("Email is not registered");
            return ResponseEntity.status(404).body("Email is not registered");
        }
        else if(result==3){
            System.out.println("First Name is not matched with given email");
            return ResponseEntity.status(401).body("First Name is not matched with given email");
        }
        else{
            System.out.println("Valid User");
            return ResponseEntity.ok("Valid User");
        }
    }

    public ResponseEntity<?> changePassword(UserDAO userDAO){
        if(userDAO.getEmail()== null || userDAO.getEmail().trim().isEmpty()){
            return ResponseEntity.status(400).body("Email cannot by Empty");
        }
        if(userDAO.getPassword()== null || userDAO.getPassword().trim().isEmpty()){
            return ResponseEntity.status(400).body("Password cannot by Empty");
        }
        if(!userDAO.getPassword().equals(userDAO.getConfirmPassword())){
            return ResponseEntity.status(400).body("Password and Confirm Password not matched");
        }

        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("changePassword");
        query.registerStoredProcedureParameter("u_email", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_password", String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("u_result", Integer.class, ParameterMode.OUT);

        userDAO.setPassword(userDAO.getPassword().trim());

        query.setParameter("u_email", userDAO.getEmail());
        query.setParameter("u_password", userDAO.getPassword());
        query.execute();

        Integer result=(Integer)query.getOutputParameterValue("u_result");
        if(result==1){
            return ResponseEntity.ok("Password Updated Successfully");
        }
        else{
            return ResponseEntity.status(404).body("Something Error occured");
        }
    }

    public ResponseEntity<?> createEmployee(Employee employee){
        if(employee.getName() == null || employee.getName().trim().isEmpty()){
            return ResponseEntity.status(400).body("Employee Name cannot be Empty");
        }
        if(employee.getEmail() == null || employee.getEmail().trim().isEmpty()){
            return ResponseEntity.status(400).body("Employee Email cannot be Empty");
        }
        if(employee.getGender() == null || employee.getGender().trim().isEmpty()){
            return ResponseEntity.status(400).body("Please select a gender");
        }
        if(employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()){
            return ResponseEntity.status(400).body("Please select a department");
        }
        if(employee.getSalary() == null || employee.getSalary() == 0){
            return ResponseEntity.status(400).body("Enter employee salary");
        }
        
        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("createEmp");
        query.registerStoredProcedureParameter(1, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(2, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(3, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(4, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(5, Long.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(6, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(7, Integer.class, ParameterMode.OUT);

        employee.setName(employee.getName().trim());
        employee.setEmail(employee.getEmail().trim());
        employee.setGender(employee.getGender().trim());
        int department=Integer.parseInt(employee.getDepartment());
        int reporting_to=Integer.parseInt(employee.getReporting_to());

        query.setParameter(1, employee.getName());
        query.setParameter(2, employee.getEmail());
        query.setParameter(3, employee.getGender());
        query.setParameter(4, department);
        query.setParameter(5, employee.getSalary());
        query.setParameter(6, reporting_to);

        query.execute();

        Integer result=(Integer)query.getOutputParameterValue(7);
        if(result==2){
            System.out.println("Email already exists");
            return ResponseEntity.status(409).body("Entered email is already given to other Employee");
        }
        else if(result==1){
            System.out.println("Employee created successfully");
            return ResponseEntity.ok("Employee Created Successfully");
        }
        else{
            return ResponseEntity.status(404).body("Something Error occured");
        }
    }
}
