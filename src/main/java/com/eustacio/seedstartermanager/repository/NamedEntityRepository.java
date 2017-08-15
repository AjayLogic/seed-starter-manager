package com.eustacio.seedstartermanager.repository;

import com.eustacio.seedstartermanager.domain.NamedEntity;

import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

/**
 * @author Wallison Freitas
 */
@NoRepositoryBean
public interface NamedEntityRepository<T extends NamedEntity> extends EntityRepository<T> {

    Optional<T> findByName();

}
