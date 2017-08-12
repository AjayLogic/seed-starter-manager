package com.eustacio.seedstartermanager.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import nl.jqno.equalsverifier.EqualsVerifier;

/**
 * @author Wallison Freitas
 */
class NamedEntityTest {

    @Test
    @DisplayName("equals() and hashCode() contract")
    void equalsAndHashCodeContract() throws Exception {
        EqualsVerifier.forClass(NamedEntity.class)
                // The property 'name' is the business key
                .withOnlyTheseFields("name")
                .verify();
    }

}