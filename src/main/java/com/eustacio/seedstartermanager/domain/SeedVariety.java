package com.eustacio.seedstartermanager.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author Wallison Freitas
 */
@Entity
@Table(name = "SEED_VARIETY")
public class SeedVariety extends NamedEntity {

    protected SeedVariety() {
        // Constructor without arguments to agree with the JPA specification
    }

    public SeedVariety(String name) {
        super(name);
    }

}
