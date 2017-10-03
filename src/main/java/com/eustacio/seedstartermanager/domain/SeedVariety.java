package com.eustacio.seedstartermanager.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * @author Wallison Freitas
 */
@Entity
@Table(name = "SEED_VARIETY")
public class SeedVariety extends NamedEntity {

    @Column(name = "IMAGE")
    private byte[] image;

    protected SeedVariety() {
        // Constructor without arguments to agree with the JPA specification
    }

    public SeedVariety(String name) {
        super(name);
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

}
