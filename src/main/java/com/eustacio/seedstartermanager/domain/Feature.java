package com.eustacio.seedstartermanager.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author Wallison Freitas
 */
@Entity
@Table(name = "FEATURE")
public class Feature extends NamedEntity {

    protected Feature() {
        // Constructor without arguments to agree with the JPA specification
    }

    public Feature(String name) {
        super(name);
    }

}
