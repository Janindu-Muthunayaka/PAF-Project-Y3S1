package com.skillora.app.Model;

import java.sql.Date;

import org.apache.tomcat.util.http.parser.Priority;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "plan")


public class PlanModel {

    @Id
    private String planId;
    private String title;
    private String description;
    private Priority priority;
    private Date creatDate;
    private Date dueDate;
    private Boolean completed;
    

    /*Define an Enum for Priority Levels
    public enum Priority {
        LOW, MEDIUM, HIGH
    } */

}
