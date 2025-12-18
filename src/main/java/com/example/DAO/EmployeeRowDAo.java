package com.example.DAO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRowDAo { // This class is used to get one employee with one project

    private Integer id;
    private String name;
    private String email;
    private String gender;
    private String department;
    private String location;
    private Long salary;
    private String reporting_to;
    private String reportingto_text;
    private Integer project_id;
}
