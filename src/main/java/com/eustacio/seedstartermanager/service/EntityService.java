package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.Entity;
import com.eustacio.seedstartermanager.repository.EntityRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author Wallison Freitas
 */
public abstract class EntityService<T extends Entity> {

    protected EntityRepository<T> repository;

    public EntityService(EntityRepository<T> repository) {
        this.repository = repository;
    }

    public abstract T save(T entity);

    public abstract boolean delete(Long id);

    public Optional<T> findById(Long id) {
        return Optional.ofNullable(repository.findOne(id));
    }

    public List<T> findAll() {
        return repository.findAll();
    }

}
