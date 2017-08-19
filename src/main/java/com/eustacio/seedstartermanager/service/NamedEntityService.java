package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.NamedEntity;

import java.util.Optional;

/**
 * @author Wallison Freitas
 */
public interface NamedEntityService<T extends NamedEntity> extends EntityService<T> {

    Optional<T> findByName(String name);

}
