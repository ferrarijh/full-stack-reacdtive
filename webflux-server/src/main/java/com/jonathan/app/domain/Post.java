package com.jonathan.app.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection="pixabaypost")
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    private String id;
    private String pageURL;
    private List<String> tags;
    private String largeImageURL;
    private int views;
    private int favorites;
    private int likes;
    private int comments;
    private String user;
    private String userImageUrl;

    private String query;
}
