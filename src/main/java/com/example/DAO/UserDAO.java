package com.example.DAO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDAO {
    String email;
    String password;
    String confirmPassword;
    String firstName;
    String lastName;
}
