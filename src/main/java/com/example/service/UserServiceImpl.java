package com.example.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.DAO.EmployeeDAO;
import com.example.DAO.EmployeeRowDAo;
import com.example.DAO.ResponseDAO;
import com.example.DAO.UserDAO;
// import com.example.entity.Employee;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import tools.jackson.databind.ObjectMapper;

@Service
public class UserServiceImpl implements UserService{

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    ObjectMapper objectMapper;
    
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

    public List<EmployeeDAO>getEmpData(){
        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("getEmp","Employee_Data");
        List<EmployeeRowDAo> rows=query.getResultList();         
        return groupEmployees(rows);
    }
    public List<EmployeeDAO> groupEmployees(List<EmployeeRowDAo> rows){
        Map<Integer, EmployeeDAO> map=new LinkedHashMap<>();

        for(EmployeeRowDAo row:rows){
            EmployeeDAO dao=map.get(row.getId());
            if(dao == null){
                dao=new EmployeeDAO();
                dao.setId(row.getId());
                dao.setName(row.getName());
                dao.setEmail(row.getEmail());
                dao.setGender(row.getGender());
                dao.setDepartment(row.getDepartment());
                dao.setLocation(row.getLocation());
                dao.setSalary(row.getSalary());
                dao.setReporting_to(row.getReporting_to());
                dao.setReportingto_text(row.getReportingto_text());
                map.put(row.getId(),dao);
            }
            if(row.getProject_id() != null){
                Map<String, Object>project=new LinkedHashMap<>();
                project.put("projectId", row.getProject_id());
                dao.getProjects().add(project);
            }
        }
        return new ArrayList<>(map.values());
    }

    public EmployeeDAO getEmpData(int id){
        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("getEmpById","Employee_Data");
        query.registerStoredProcedureParameter(1, Integer.class, ParameterMode.IN);
        query.setParameter(1, id);
        query.execute();
        List<EmployeeRowDAo>rows= query.getResultList();
        List<EmployeeDAO>list= groupEmployees(rows);
        return list.isEmpty()? null: list.get(0);
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

    public ResponseEntity<?> createEmployee(EmployeeDAO employeeDAO){
        if(employeeDAO.getName() == null || employeeDAO.getName().trim().isEmpty()){
            return ResponseEntity.status(400).body("Employee Name cannot be Empty");
        }
        if(employeeDAO.getEmail() == null || employeeDAO.getEmail().trim().isEmpty()){
            return ResponseEntity.status(400).body("Employee Email cannot be Empty");
        }
        if(employeeDAO.getGender() == null || employeeDAO.getGender().trim().isEmpty()){
            return ResponseEntity.status(400).body("Please select a gender");
        }
        if(employeeDAO.getDepartment() == null || employeeDAO.getDepartment().trim().isEmpty()){
            return ResponseEntity.status(400).body("Please select a department");
        }
        if(employeeDAO.getSalary() == null || employeeDAO.getSalary() == 0){
            return ResponseEntity.status(400).body("Enter employee salary");
        }
        
        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("ADD_EDIT_EMPLOYEE");
        query.registerStoredProcedureParameter(1, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(2, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(3, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(4, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(5, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(6, Long.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(7, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(8, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(9, Integer.class, ParameterMode.OUT);
        query.registerStoredProcedureParameter(10, Integer.class, ParameterMode.OUT);

        employeeDAO.setName(employeeDAO.getName().trim());
        employeeDAO.setEmail(employeeDAO.getEmail().trim());
        employeeDAO.setGender(employeeDAO.getGender().trim());
        int department=Integer.parseInt(employeeDAO.getDepartment());
        Integer reporting_to=null;
        String rt=employeeDAO.getReporting_to();
         if(rt!=null && !rt.trim().isEmpty()){
            reporting_to=Integer.parseInt(employeeDAO.getReporting_to());
        }

        List<String>projectIds=new ArrayList<>();
        for(Map<String, Object>projects:employeeDAO.getProjects()){
            projectIds.add(projects.get("projectId").toString());
        }
        String projectsJson=objectMapper.writeValueAsString(projectIds);

        query.setParameter(1, employeeDAO.getId());
        query.setParameter(2, employeeDAO.getName());
        query.setParameter(3, employeeDAO.getEmail());
        query.setParameter(4, employeeDAO.getGender());
        query.setParameter(5, department);
        query.setParameter(6, employeeDAO.getSalary());
        query.setParameter(7, reporting_to);
        query.setParameter(8, projectsJson);
        query.execute();

        Integer generatedId=(Integer)query.getOutputParameterValue(9);
        Integer result=(Integer)query.getOutputParameterValue(10);
        if(result==2){
            System.out.println("Email already exists");
            return ResponseEntity.status(409).body("Entered email is already given to other Employee");
        }
        else if(result==1){
            System.out.println("Employee created successfully");
            return ResponseEntity.ok(generatedId);
        }
        else{
            return ResponseEntity.status(404).body("Something Error occured");
        }
    }

    public ResponseEntity<?> updateEmployee(EmployeeDAO employeeDAO){
        if(employeeDAO.getName()==null || employeeDAO.getName().trim().isEmpty()){
            return ResponseEntity.status(400).body("Employee Name cannot be Empty");
        }
        if(employeeDAO.getGender() == null || employeeDAO.getGender().trim().isEmpty()){
            return ResponseEntity.status(400).body("Please select a gender");       
        }
        if(employeeDAO.getDepartment() == null || employeeDAO.getDepartment().trim().isEmpty()){
            return ResponseEntity.status(400).body("Please select a department");
        }
        if(employeeDAO.getSalary() == null || employeeDAO.getSalary() == 0){
            return ResponseEntity.status(400).body("Enter employee salary");
        }

        StoredProcedureQuery query=entityManager.createStoredProcedureQuery("ADD_EDIT_EMPLOYEE");
        query.registerStoredProcedureParameter(1, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(2, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(3, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(4, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(5, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(6, Long.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(7, Integer.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(8, String.class, ParameterMode.IN);
        query.registerStoredProcedureParameter(9, Integer.class, ParameterMode.OUT);
        query.registerStoredProcedureParameter(10, Integer.class, ParameterMode.OUT);

        employeeDAO.setName(employeeDAO.getName().trim());
        employeeDAO.setGender(employeeDAO.getGender().trim());
        int department=Integer.parseInt(employeeDAO.getDepartment());
        Integer reporting_to=null;
        String rt = employeeDAO.getReporting_to();
        if(rt!=null && !rt.trim().isEmpty()){
            reporting_to=Integer.parseInt(rt.trim());
        }

        List<String>projectIds=new ArrayList<>();
        for(Map<String, Object>projects:employeeDAO.getProjects()){
            projectIds.add(projects.get("projectId").toString());
        }
        String projectsJson=objectMapper.writeValueAsString(projectIds);

        query.setParameter(1, employeeDAO.getId());
        query.setParameter(2, employeeDAO.getName());
        query.setParameter(3, employeeDAO.getGender());
        query.setParameter(4, employeeDAO.getGender());
        query.setParameter(5, department);
        query.setParameter(6, employeeDAO.getSalary());
        query.setParameter(7,reporting_to);
        query.setParameter(8, projectsJson);
        query.execute();

        Integer updatedId=(Integer)query.getOutputParameterValue(9);
        Integer result=(Integer)query.getOutputParameterValue(10);
        if(result==1){
            System.out.println("Employee Details Updated Successfully");
            return ResponseEntity.ok(updatedId);
        }
        else if(result==2){
            return ResponseEntity.status(409).body("Given ID does not exists");
        }
        else{
            return ResponseEntity.status(404).body("Something Error Occured");
        }
    }
}
