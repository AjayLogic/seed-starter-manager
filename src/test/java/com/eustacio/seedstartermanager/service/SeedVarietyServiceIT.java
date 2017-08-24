package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.IntegrationTest;
import com.eustacio.seedstartermanager.domain.SeedVariety;
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
class SeedVarietyServiceIT {

    @Autowired
    private SeedVarietyService varietyService;

    @Test
    void save() {
        SeedVariety newSeedVariety = new SeedVariety("Encephalartos Woodii");

        SeedVariety savedSeedVariety = varietyService.save(newSeedVariety);

        assertThat(savedSeedVariety).isNotNull();
        assertThat(savedSeedVariety.getId()).isPositive();
        assertThat(savedSeedVariety.getName()).isEqualTo(newSeedVariety.getName());
    }

    @Test
    @DisplayName("save() should throw DuplicateNameException when SeedVariety already exists")
    void save_ShouldThrow_DuplicateNameException_WhenVarietyAlreadyExists() {
        SeedVariety alreadyExistentVariety = new SeedVariety("Thymus Caespititius");

        assertThatExceptionOfType(DuplicateNameException.class)
                .isThrownBy(() -> varietyService.save(alreadyExistentVariety));
    }

    @Test
    void delete() {
        Long thymusCamphoratusId = 3L;

        boolean isDeleted = varietyService.delete(thymusCamphoratusId);

        assertThat(isDeleted).isTrue();
        assertThat(varietyService.findById(thymusCamphoratusId)).isEmpty();
    }

    @Test
    void findById() {
        Long thymusCapitellatusId = 3L;

        Optional<SeedVariety> variety = varietyService.findById(thymusCapitellatusId);

        assertThat(variety).isPresent();
        variety.ifPresent(feat -> {
            assertThat(feat.getId()).isEqualTo(thymusCapitellatusId);
            assertThat(feat.getName()).isEqualTo("Thymus Capitellatus");
        });
    }

    @Test
    void findByName() {
        String thymusCaespititius = "Thymus Caespititius";

        Optional<SeedVariety> variety = varietyService.findByName(thymusCaespititius);

        assertThat(variety).isPresent();
        variety.ifPresent(feat ->
                assertThat(feat.getName()).isEqualTo(thymusCaespititius)
        );
    }

    @Test
    void findAll() {
        SeedVariety thymusCaespititius = new SeedVariety("Thymus Caespititius");
        SeedVariety thymusCamphoratus = new SeedVariety("Thymus Camphoratus");
        SeedVariety thymusCapitellatus = new SeedVariety("Thymus Capitellatus");

        List<SeedVariety> seedVarietyList = varietyService.findAll();

        assertThat(seedVarietyList).containsOnly(thymusCaespititius, thymusCamphoratus, thymusCapitellatus);
    }

}
