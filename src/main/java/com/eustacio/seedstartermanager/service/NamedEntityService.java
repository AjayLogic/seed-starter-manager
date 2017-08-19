package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.NamedEntity;
import com.eustacio.seedstartermanager.repository.NamedEntityRepository;

import java.util.Optional;

/**
 * @author Wallison Freitas
 */
public abstract class NamedEntityService<T extends NamedEntity> extends EntityService<T> {

    private NamedEntityRepository<T> repository;

    public NamedEntityService(NamedEntityRepository<T> repository) {
        super(repository);
        this.repository = repository;
    }

    public Optional<T> findByName(String name) {
        return this.repository.findByName(name);
    }

}
