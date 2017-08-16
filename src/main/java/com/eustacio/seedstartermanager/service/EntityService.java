package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.Entity;

import java.util.List;
import java.util.Optional;

/**
 * @author Wallison Freitas
 */
public interface EntityService<T extends Entity> {

    T save(T entity);

    Optional<T> findById(Long id);

    List<T> findAll();

    boolean delete(Long id);

}
