package com.jonathan.app.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection="pixabaypost")
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    private String id;
    private String largeImageUrl;
    private String user;
    private String query;
}
