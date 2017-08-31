package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.IntegrationTest;
import com.eustacio.seedstartermanager.domain.Feature;
import com.eustacio.seedstartermanager.exception.DuplicateNameException;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;

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
class FeatureServiceTestIT {

    @Autowired
    private FeatureService featureService;

    @Test
    void save() {
        Feature newFeature = new Feature("Immortality");

        Feature savedFeature = featureService.save(newFeature);

        assertThat(savedFeature).isNotNull();
        assertThat(savedFeature.getId()).isPositive();
        assertThat(savedFeature.getName()).isEqualTo(newFeature.getName());
    }

    @Test
    @DisplayName("save() should throw DuplicateNameException when Feature already exists")
    void save_ShouldThrow_DuplicateNameException_WhenFeatureAlreadyExists() {
        Feature alreadyExistentFeature = new Feature("Fertilizer");

        assertThatExceptionOfType(DuplicateNameException.class)
                .isThrownBy(() -> featureService.save(alreadyExistentFeature));
    }

    @Test
    void delete() {
        Long phCorrectorId = 3L;

        boolean isDeleted = featureService.delete(phCorrectorId);

        assertThat(isDeleted).isTrue();
        assertThat(featureService.findById(phCorrectorId)).isEmpty();
    }

    @Test
    @DisplayName("delete() should throw EmptyResultDataAccessException when Feature is not found")
    void delete_ShouldThrowEmptyResultDataAccessException_WhenFeatureIsNotFound() {
        Long nonexistentEntity = 69L;

        assertThatExceptionOfType(EntityNotFoundException.class)
                .isThrownBy(() -> featureService.delete(nonexistentEntity));
    }

    @Test
    void findById() {
        Long fertilizerId = 2L;

        Optional<Feature> feature = featureService.findById(fertilizerId);

        assertThat(feature).isPresent();
        feature.ifPresent(feat -> {
            assertThat(feat.getId()).isEqualTo(fertilizerId);
            assertThat(feat.getName()).isEqualTo("Fertilizer");
        });
    }

    @Test
    void findByName() {
        String phCorrector = "Ph Corrector";

        Optional<Feature> feature = featureService.findByName(phCorrector);

        assertThat(feature).isPresent();
        feature.ifPresent(feat ->
                assertThat(feat.getName()).isEqualTo(phCorrector)
        );
    }

    @Test
    void findAll() {
        Feature specificSubstrate = new Feature("Specific Substrate");
        Feature fertilizer = new Feature("Fertilizer");
        Feature phCorrector = new Feature("Ph Corrector");

        List<Feature> featureList = featureService.findAll();

        assertThat(featureList).containsOnly(specificSubstrate, fertilizer, phCorrector);
    }

}
