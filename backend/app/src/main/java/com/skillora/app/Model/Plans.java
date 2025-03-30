package com.skillora.app.Model;

import java.sql.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "plans")
public class Plans {

    @Id
    private String planId;

    private String title;

    private String description;

    private Boolean completed;

    private Date createdAt;

    


}
