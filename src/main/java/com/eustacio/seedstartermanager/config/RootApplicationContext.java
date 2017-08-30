package com.eustacio.seedstartermanager.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;

/**
 * @author Wallison Freitas
 */
@Configuration
@ComponentScan(value = "com.eustacio.seedstartermanager", excludeFilters = {
        @ComponentScan.Filter(type = FilterType.REGEX, pattern = {
                // Let the web context scan your own beans
                "com.eustacio.seedstartermanager.config.web.*",
                "com.eustacio.seedstartermanager.web.*"
        })
})
public class RootApplicationContext {

}
