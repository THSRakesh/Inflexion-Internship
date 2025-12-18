package com.example.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.DAO.EmployeeDAO;
import com.example.DAO.UserDAO;
// import com.example.entity.Employee;

public interface UserService {
    ResponseEntity<?> registerUser(UserDAO userDAO);
    ResponseEntity<?> loginUser(UserDAO userDAO);
    List<EmployeeDAO>getEmpData();
    EmployeeDAO getEmpData(int id);
    ResponseEntity<?> forgotPassword(UserDAO userDAO);
    ResponseEntity<?> changePassword(UserDAO userDAO);
    ResponseEntity<?> createEmployee(EmployeeDAO employeeDAO);
    ResponseEntity<?> updateEmployee(EmployeeDAO employeeDAO);
}
