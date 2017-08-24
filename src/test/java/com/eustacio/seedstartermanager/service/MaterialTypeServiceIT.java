package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.IntegrationTest;
import com.eustacio.seedstartermanager.domain.MaterialType;
import com.eustacio.seedstartermanager.exception.DuplicateNameException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * @author Wallison Freitas
 */
@IntegrationTest
class MaterialTypeServiceIT {

    @Autowired
    private MaterialTypeService materialTypeService;

    @Test
    void save() {
        MaterialType newMaterialType = new MaterialType("Adamantium");

        MaterialType savedSeedVariety = materialTypeService.save(newMaterialType);

        assertThat(savedSeedVariety).isNotNull();
        assertThat(savedSeedVariety.getId()).isPositive();
        assertThat(savedSeedVariety.getName()).isEqualTo(newMaterialType.getName());
    }

    @Test
    @DisplayName("save() should throw DuplicateNameException when MaterialType already exists")
    void save_ShouldThrow_DuplicateNameException_WhenMaterialTypeAlreadyExists() {
        MaterialType alreadyExistentVariety = new MaterialType("Plastic");

        assertThatExceptionOfType(DuplicateNameException.class)
                .isThrownBy(() -> materialTypeService.save(alreadyExistentVariety));
    }

    @Test
    void delete() {
        Long plasticId = 1L;

        boolean isDeleted = materialTypeService.delete(plasticId);

        assertThat(isDeleted).isTrue();
        assertThat(materialTypeService.findById(plasticId)).isEmpty();
    }

    @Test
    void findById() {
        Long ironId = 3L;

        Optional<MaterialType> materialType = materialTypeService.findById(ironId);

        assertThat(materialType).isPresent();
        materialType.ifPresent(feat -> {
            assertThat(feat.getId()).isEqualTo(ironId);
            assertThat(feat.getName()).isEqualTo("Iron");
        });
    }

    @Test
    void findByName() {
        String wood = "Wood";

        Optional<MaterialType> materialType = materialTypeService.findByName(wood);

        assertThat(materialType).isPresent();
        materialType.ifPresent(feat ->
                assertThat(feat.getName()).isEqualTo(wood)
        );
    }

    @Test
    void findAll() {
        MaterialType Plastic = new MaterialType("Plastic");
        MaterialType Wood = new MaterialType("Wood");
        MaterialType Iron = new MaterialType("Iron");

        List<MaterialType> materialTypeList = materialTypeService.findAll();

        assertThat(materialTypeList).containsOnly(Plastic, Wood, Iron);
    }

}
