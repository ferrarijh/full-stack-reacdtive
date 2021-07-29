package com.jonathan.app.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix="pixabay")
@Getter
@Setter
public class ConfigProperties {
    private String imgSaveDir;
    private String baseUrl;
}