package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.SeedStarter;
import com.eustacio.seedstartermanager.repository.SeedStarterRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Wallison Freitas
 */
@Service
public class SeedStarterService extends EntityService<SeedStarter> {

    @Autowired
    public SeedStarterService(SeedStarterRepository repository) {
        super(repository);
    }

    @Override
    public SeedStarter save(SeedStarter seedStarter) {
        return repository.save(seedStarter);
    }

    @Override
    public boolean delete(Long id) {
        super.repository.deleteById(id);
        return !super.repository.existsById(id);
    }

}
