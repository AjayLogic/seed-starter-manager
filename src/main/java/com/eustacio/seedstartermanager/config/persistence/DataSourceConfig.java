package com.eustacio.seedstartermanager.config.persistence;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import java.nio.charset.StandardCharsets;

import javax.sql.DataSource;

/**
 * @author Wallison Freitas
 */
@Configuration
public class DataSourceConfig {

    @Bean("dataSource")
    @Profile("dev")
    public DataSource developmentDataSource() {
        return new EmbeddedDatabaseBuilder()
                .setName("embedded_database")
                .setType(EmbeddedDatabaseType.H2)
                .setScriptEncoding(StandardCharsets.UTF_8.name())
                .addDefaultScripts()
                .build();
    }

    @Bean("dataSource")
    @Profile("integration-test")
    public DataSource integrationTestDataSource() {
        return new EmbeddedDatabaseBuilder()
                .generateUniqueName(true)
                .setType(EmbeddedDatabaseType.H2)
                .setScriptEncoding(StandardCharsets.UTF_8.name())
                .addScripts("schema.sql", "data-test.sql")
                .build();
    }

}
