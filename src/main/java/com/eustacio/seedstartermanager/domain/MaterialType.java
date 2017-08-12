package com.eustacio.seedstartermanager.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author Wallison Freitas
 */
@Entity
@Table(name = "MATERIAL_TYPE")
public class MaterialType extends NamedEntity {

    protected MaterialType() {
        // Constructor without arguments to agree with the JPA specification
    }

    public MaterialType(String name) {
        super(name);
    }

}
