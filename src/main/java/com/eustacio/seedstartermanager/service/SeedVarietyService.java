package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.SeedVariety;
import com.eustacio.seedstartermanager.exception.DuplicateNameException;
import com.eustacio.seedstartermanager.repository.SeedVarietyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

/**
 * @author Wallison Freitas
 */
@Service
public class SeedVarietyService extends NamedEntityService<SeedVariety> {

    @Autowired
    public SeedVarietyService(SeedVarietyRepository repository) {
        super(repository);
    }

    @Override
    public SeedVariety save(SeedVariety variety) {
        SeedVariety savedVariety;
        try {
            savedVariety = repository.save(variety);
        } catch (DataIntegrityViolationException dataIntegrityViolationException) {
            throw new DuplicateNameException("Cannot save the SeedVariety '" + variety.getName() +
                    "', because it already exists", dataIntegrityViolationException);
        }

        return savedVariety;
    }

    @Override
    public boolean delete(Long id) {
        super.repository.deleteById(id);
        return !super.repository.existsById(id);
    }

}
