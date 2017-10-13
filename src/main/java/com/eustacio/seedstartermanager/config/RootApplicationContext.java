package com.eustacio.seedstartermanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * @author Wallison Freitas
 */
@Configuration
@PropertySource("classpath:application.properties")
@ComponentScan(value = "com.eustacio.seedstartermanager", excludeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = {
                // Let the web context scan your own beans
                "com.eustacio.seedstartermanager.config.web.*",
                "com.eustacio.seedstartermanager.web.*"
        })
})
public class RootApplicationContext {

    @Bean
    public PropertySourcesPlaceholderConfigurer placeholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

}
