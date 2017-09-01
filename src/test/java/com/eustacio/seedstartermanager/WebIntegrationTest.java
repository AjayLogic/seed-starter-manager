package com.eustacio.seedstartermanager;

import com.eustacio.seedstartermanager.config.web.WebApplicationContext;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.web.SpringJUnitWebConfig;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author Wallison Freitas
 */
@ActiveProfiles("dev")
@SpringJUnitWebConfig(classes = WebApplicationContext.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface WebIntegrationTest {

}
