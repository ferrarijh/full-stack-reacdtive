package com.jonathan.app.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix="spring")
@Getter
@Setter
public class DirConfigProperties {
    private String imgSaveDir;
}