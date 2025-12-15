package com.example.entity;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityResult;
import jakarta.persistence.FieldResult;
import jakarta.persistence.Id;
import jakarta.persistence.SqlResultSetMapping;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Component
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@SqlResultSetMapping( name="Employee_Data", entities = {
    @EntityResult( entityClass = Employee.class, fields={
        @FieldResult(name="id", column = "id"),
        @FieldResult(name="name", column = "name"),
        @FieldResult(name="email", column = "email"),
        @FieldResult(name="gender", column = "gender"),
        @FieldResult(name="department", column = "department"),
        @FieldResult(name="location", column = "location"),
        @FieldResult(name="salary", column = "salary"),
        @FieldResult(name="reporting_to", column = "reporting_to"),
        @FieldResult(name="reportingto_text", column = "reportingto_text")
    })
})
public class Employee {
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
}
