package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.domain.MaterialType;
import com.eustacio.seedstartermanager.exception.DuplicateNameException;
import com.eustacio.seedstartermanager.repository.MaterialTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

/**
 * @author Wallison Freitas
 */
@Service
public class MaterialTypeService extends NamedEntityService<MaterialType> {

    @Autowired
    public MaterialTypeService(MaterialTypeRepository repository) {
        super(repository);
    }

    @Override
    public MaterialType save(MaterialType materialType) {
        MaterialType savedMaterialType;

        try {
            savedMaterialType = super.repository.save(materialType);
        } catch (DataIntegrityViolationException dataIntegrityViolationException) {
            throw new DuplicateNameException("Cannot save the MaterialType '" + materialType.getName() +
                    "', because it already exists", dataIntegrityViolationException);
        }

        return savedMaterialType;
    }

    @Override
    public boolean delete(Long id) {
        super.repository.deleteById(id);
        return !super.repository.existsById(id);
    }

}
