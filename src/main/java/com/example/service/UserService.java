package com.example.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.DAO.UserDAO;
import com.example.entity.Employee;

public interface UserService {
    ResponseEntity<?> registerUser(UserDAO userDAO);
    ResponseEntity<?> loginUser(UserDAO userDAO);
    List<Employee>getEmpData();
    Employee getEmpData(int id);
    ResponseEntity<?> forgotPassword(UserDAO userDAO);
    ResponseEntity<?> changePassword(UserDAO userDAO);
    ResponseEntity<?> createEmployee(Employee employee);
    ResponseEntity<?> updateEmployee(Employee employee);
}
