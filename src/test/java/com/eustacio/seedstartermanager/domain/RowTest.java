package com.eustacio.seedstartermanager.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

/**
 * @author Wallison Freitas
 */
class RowTest {

    @Test
    @DisplayName("equals() and hashCode() contract")
    void equalsAndHashCodeContract() throws Exception {
        EqualsVerifier.forClass(Row.class)
                // Two new objects are never equal to each other
                .suppress(Warning.IDENTICAL_COPY_FOR_VERSIONED_ENTITY)

                // Used to avoid Recursive datastructure assertion error.
                // More info on http://jqno.nl/equalsverifier/errormessages/recursive-datastructure
                .withPrefabValues(SeedStarter.class,
                        new SeedStarter(new MaterialType("Adamantium"), LocalDate.now(), false),
                        new SeedStarter(new MaterialType("Vibranium"), LocalDate.now(), true))

                .verify();
    }

}