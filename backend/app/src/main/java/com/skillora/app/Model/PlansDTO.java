package com.skillora.app.Model;



import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "plans")

public class PlansDTO {
    
    @Id
    private String id;

    @NotNull(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Completed is required")
    private Boolean completed;
    private Date createdAt;
    private Date updatedAt;

    @NotNull(message = "Due Date is required")
    private Date dueDate;
    private String priority;
    
    /*public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }*/
    
    

   
}
