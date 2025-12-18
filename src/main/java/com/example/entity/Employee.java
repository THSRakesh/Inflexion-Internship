package com.example.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.Entity;
// import jakarta.persistence.EntityResult;
// import jakarta.persistence.FieldResult;
import jakarta.persistence.Id;
import jakarta.persistence.SqlResultSetMapping;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
// @SqlResultSetMapping( name="Employee_Data", entities = {
//     @EntityResult( entityClass = Employee.class, fields={
//         @FieldResult(name="id", column = "id"),
//         @FieldResult(name="name", column = "name"),
//         @FieldResult(name="email", column = "email"),
//         @FieldResult(name="gender", column = "gender"),
//         @FieldResult(name="department", column = "department"),
//         @FieldResult(name="location", column = "location"),
//         @FieldResult(name="salary", column = "salary"),
//         @FieldResult(name="reporting_to", column = "reporting_to"),
//         @FieldResult(name="reportingto_text", column = "reportingto_text"),
//         @FieldResult(name="project_id", column = "project_id")
//     })
// })
@SqlResultSetMapping(
    name = "Employee_Data",
    classes = {
        @ConstructorResult(
            targetClass = com.example.DAO.EmployeeRowDAo.class,
            columns = {
                @ColumnResult(name = "id", type = Integer.class),
                @ColumnResult(name = "name", type = String.class),
                @ColumnResult(name = "email", type = String.class),
                @ColumnResult(name = "gender", type = String.class),
                @ColumnResult(name = "department", type = String.class),
                @ColumnResult(name = "location", type = String.class),
                @ColumnResult(name = "salary", type = Long.class),
                @ColumnResult(name = "reporting_to", type = String.class),
                @ColumnResult(name = "reportingto_text", type = String.class),
                @ColumnResult(name = "project_id", type = Integer.class)
            }
        )
    }
)
public class Employee { // This class is used to read the SQL result data
    @Id
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
