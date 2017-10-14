package com.eustacio.seedstartermanager.config.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author Wallison Freitas
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {
        "com.eustacio.seedstartermanager.config.web",
        "com.eustacio.seedstartermanager.web"
})
public class WebApplicationContext implements WebMvcConfigurer {

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

}
