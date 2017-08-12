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
                .verify();
    }

}
