package com.eustacio.seedstartermanager.repository;

import com.eustacio.seedstartermanager.domain.Entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * @author Wallison Freitas
 */
@NoRepositoryBean
public interface EntityRepository<T extends Entity> extends JpaRepository<T, Long> {

}
