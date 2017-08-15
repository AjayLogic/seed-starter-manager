package com.eustacio.seedstartermanager.config.persistence;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaDialect;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaDialect;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;

/**
 * @author Wallison Freitas
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories("com.eustacio.seedstartermanager.repository")
public class PersistenceConfig {

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

    @Bean
    public HibernateJpaDialect hibernateJpaDialect() {
        return new HibernateJpaDialect();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(JpaVendorAdapter jpaVendorAdapter, JpaDialect jpaDialect) {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
        emf.setJpaVendorAdapter(jpaVendorAdapter);
        emf.setJpaDialect(jpaDialect);
        emf.setPackagesToScan("com.eustacio.seedstartermanager.domain");
        return emf;
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

}
