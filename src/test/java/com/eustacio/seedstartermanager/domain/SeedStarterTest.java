package com.eustacio.seedstartermanager.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

/**
 * @author Wallison Freitas
 */
class SeedStarterTest {

    @Test
    @DisplayName("equals() and hashCode() contract")
    void equalsAndHashCodeContract() throws Exception {
        EqualsVerifier.forClass(SeedStarter.class)
                // Two new objects are never equal to each other
                .suppress(Warning.IDENTICAL_COPY_FOR_VERSIONED_ENTITY)

                // Used to avoid Recursive datastructure assertion error.
                // More info on http://jqno.nl/equalsverifier/errormessages/recursive-datastructure
                .withPrefabValues(Row.class,
                        new Row(new SeedVariety("Aldrovanda Vesiculosa"), 2),
                        new Row(new SeedVariety("Amorphophallus titanum"), 3))

                .verify();
    }

}
