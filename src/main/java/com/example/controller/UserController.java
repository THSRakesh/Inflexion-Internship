package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.DAO.ResponseDAO;
import com.example.DAO.UserDAO;
import com.example.entity.Employee;
import com.example.service.UserService;

@RestController
public class UserController {
    
    @Autowired
    UserService userService;

    @Autowired
    ResponseDAO responseDAO;

    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDAO userDAO){
        return userService.registerUser(userDAO);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDAO userDAO){
        System.out.println("Email = " + userDAO.getEmail());
        System.out.println("Password = " + userDAO.getPassword());
        return userService.loginUser(userDAO);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/employee")
    public List<Employee>getEmpData(){
        return userService.getEmpData();
    }

    @CrossOrigin(origins= "*")
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody UserDAO userDAO){
        return userService.forgotPassword(userDAO);
    }

    @CrossOrigin(origins= "*")
    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody UserDAO userDAO){
        return userService.changePassword(userDAO);
    }

    @CrossOrigin(origins="*")
    @PostMapping("/createEmp")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee){
        return userService.createEmployee(employee);
    }
}
