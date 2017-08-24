package com.eustacio.seedstartermanager.service;

import com.eustacio.seedstartermanager.IntegrationTest;
import com.eustacio.seedstartermanager.domain.Entity;
import com.eustacio.seedstartermanager.domain.Feature;
import com.eustacio.seedstartermanager.domain.MaterialType;
import com.eustacio.seedstartermanager.domain.Row;
import com.eustacio.seedstartermanager.domain.SeedStarter;
import com.eustacio.seedstartermanager.domain.SeedVariety;
import com.eustacio.seedstartermanager.repository.RowRepository;

import org.assertj.core.api.SoftAssertions;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * @author Wallison Freitas
 */
@IntegrationTest
class SeedStarterServiceIT {

    @Autowired
    private SeedStarterService seedStarterService;

    @Autowired
    private RowRepository rowRepository;

    @Autowired
    private MaterialTypeService materialTypeService;

    @Autowired
    private FeatureService featureService;

    @Autowired
    private SeedVarietyService seedVarietyService;

    @Test
    void save() {
        MaterialType plastic = getEntityWithId(1L, materialTypeService);

        LocalDate datePlanted = LocalDate.of(2017, Month.APRIL, 1);

        Feature specificSubstrate = getEntityWithId(1L, featureService);
        Feature fertilizer = getEntityWithId(2L, featureService);
        List<Feature> features = Lists.newArrayList(specificSubstrate, fertilizer);

        SeedVariety thymusCamphoratus = getEntityWithId(2L, seedVarietyService);
        SeedVariety thymusCapitellatus = getEntityWithId(3L, seedVarietyService);

        Row row1 = new Row(thymusCamphoratus, 3);
        Row row2 = new Row(thymusCapitellatus, 1);
        List<Row> rows = Lists.newArrayList(row1, row2);

        SeedStarter seedStarter = new SeedStarter(plastic, datePlanted, true, features, rows);


        SeedStarter savedSeedStarter = seedStarterService.save(seedStarter);


        assertThat(savedSeedStarter).isNotNull();
        assertThat(savedSeedStarter.getId()).isPositive();
        SoftAssertions.assertSoftly(softly -> {
            SeedStarter seedStarterFound = getEntityWithId(savedSeedStarter.getId(), seedStarterService);

            softly.assertThat(seedStarterFound.getMaterialType())
                    .as("Property 'materialType' of the SeedStarter")
                    .isEqualTo(plastic);

            softly.assertThat(seedStarterFound.getDatePlanted())
                    .as("Property 'datePlanted' of the SeedStarter")
                    .isEqualTo(datePlanted);

            softly.assertThat(seedStarterFound.isCovered())
                    .as("Property 'isCovered' of the SeedStarter")
                    .isTrue();

            softly.assertThat(seedStarterFound.getFeatures())
                    .as("Property 'features' of the SeedStarter")
                    .containsOnlyElementsOf(features);

            softly.assertThat(seedStarterFound.getRows())
                    .as("Property 'rows' of the SeedStarter")
                    .containsOnlyElementsOf(rows);

            softly.assertThat(seedStarterFound.getRows())
                    .extracting(Row::getSeedsPerCell)
                    .as("Property 'seedsPerCell' of each Row")
                    .containsOnly(row1.getSeedsPerCell(), row2.getSeedsPerCell());

            softly.assertThat(seedStarterFound.getRows())
                    .extracting(row -> row.getSeedVariety().getName())
                    .as("Property 'name' of the SeedVariety in each Row")
                    .containsOnly(thymusCamphoratus.getName(), thymusCapitellatus.getName());
        });
    }

    private <T extends Entity> T getEntityWithId(Long id, EntityService<T> service) {
        return service
                .findById(id)
                .orElseThrow(() -> new IllegalStateException("The requested entity could not be found"));
    }

    @Test
    @DisplayName("delete()  should delete only the SeedStarter and yours Rows")
    void delete_ShouldDeleteOnlyTheSeedStarterAndYoursRows() {
        int numberOfSeedStarterBeforeDelete = seedStarterService.findAll().size();
        int numberOfRowsBeforeDelete = (int) rowRepository.count();
        int numberOfFeaturesBeforeDelete = featureService.findAll().size();
        int numberOfVarietiesBeforeDelete = seedVarietyService.findAll().size();
        int numberOfMaterialsBeforeDelete = materialTypeService.findAll().size();
        Long seedStarterId = 1L;


        boolean wasDeleted = seedStarterService.delete(seedStarterId);


        int numberOfSeedStarterAfterDelete = seedStarterService.findAll().size();
        int numberOfRowsAfterDelete = (int) rowRepository.count();
        int numberOfFeaturesAfterDelete = featureService.findAll().size();
        int numberOfVarietiesAfterDelete = seedVarietyService.findAll().size();
        int numberOfMaterialsAfterDelete = materialTypeService.findAll().size();

        assertThat(wasDeleted).isTrue();
        assertThat(seedStarterService.findById(seedStarterId)).isNotPresent();
        SoftAssertions.assertSoftly(softly -> {
            softly.assertThat(numberOfSeedStarterAfterDelete)
                    .as("Number of SeedStarter after delete only one")
                    .isEqualTo(numberOfSeedStarterBeforeDelete - 1);

            softly.assertThat(numberOfRowsAfterDelete)
                    .as("Number of Row's after delete the SeedStarter")
                    .isEqualTo(numberOfRowsBeforeDelete - 2);

            // Asserting that no other entities has been excluded

            softly.assertThat(numberOfFeaturesAfterDelete)
                    .as("Number of Feature's after delete the SeedStarter")
                    .isEqualTo(numberOfFeaturesBeforeDelete);

            softly.assertThat(numberOfVarietiesAfterDelete)
                    .as("Number of SeedVariety's after delete the SeedStarter")
                    .isEqualTo(numberOfVarietiesBeforeDelete);

            softly.assertThat(numberOfMaterialsAfterDelete)
                    .as("Number of MaterialType's after delete the SeedStarter")
                    .isEqualTo(numberOfMaterialsBeforeDelete);
        });
    }

    @Test
    void findById() {
        Long requestedId = 1L;

        Optional<SeedStarter> seedStarterFound = seedStarterService.findById(requestedId);

        assertThat(seedStarterFound).isPresent();
        seedStarterFound.ifPresent(seedStarter -> SoftAssertions.assertSoftly(softly -> {
            softly.assertThat(seedStarter.getId()).isEqualTo(requestedId);

            softly.assertThat(seedStarter.getMaterialType().getName())
                    .as("Property 'materialType' of the SeedStarter")
                    .isEqualTo("Plastic");

            softly.assertThat(seedStarter.getDatePlanted())
                    .as("Property 'datePlanted' of the SeedStarter")
                    .isEqualTo(LocalDate.of(2017, Month.APRIL, 1));

            softly.assertThat(seedStarter.isCovered())
                    .as("Property 'isCovered' of the SeedStarter")
                    .isTrue();

            softly.assertThat(seedStarter.getFeatures())
                    .extracting(Feature::getName)
                    .as("Property 'features' of the SeedStarter")
                    .containsOnly("Specific Substrate", "Fertilizer");

            softly.assertThat(seedStarter.getRows())
                    .extracting(Row::getSeedsPerCell)
                    .as("Property 'seedsPerCell' of each Row")
                    .containsOnly(3, 2);

            softly.assertThat(seedStarter.getRows())
                    .extracting(row -> row.getSeedVariety().getName())
                    .as("Property 'name' of the SeedVariety in each Row")
                    .containsOnly("Thymus Caespititius", "Thymus Camphoratus");
        }));
    }

    @Test
    void findAll() {
        List<SeedStarter> seedStarterList = seedStarterService.findAll();

        assertThat(seedStarterList).hasSize(3);
    }

}
