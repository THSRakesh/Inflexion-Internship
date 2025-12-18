package com.example.DAO;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDAO { // This class is for showing only single employee data with multple projects in the UI

    private Integer id;
    private String name;
    private String email;
    private String gender;
    private String department;
    private String location;
    private Long salary;
    private String reporting_to;
    private String reportingto_text;

    private List<Map<String, Object>>projects = new ArrayList<>();
}

