package com.eustacio.seedstartermanager.domain;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * @author Wallison Freitas
 */
@javax.persistence.Entity
@Table(name = "ROW")
public class Row extends Entity {

    public static final int MIN_SEEDS_PER_CELL = 0;
    public static final int MAX_SEEDS_PER_CELL = 10;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "SEED_VARIETY_ID", nullable = false)
    private SeedVariety seedVariety;

    @Min(MIN_SEEDS_PER_CELL)
    @Max(MAX_SEEDS_PER_CELL)
    @Column(name = "SEEDS_PER_CELL", nullable = false)
    private Integer seedsPerCell;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SEED_STARTER_ID", nullable = false)
    private SeedStarter seedStarter;

    protected Row() {
        // Constructor without arguments to agree with the JPA specification
    }

    public Row(SeedVariety seedVariety, Integer seedsPerCell) {
        this.seedVariety = seedVariety;
        this.seedsPerCell = seedsPerCell;
    }

    public SeedVariety getSeedVariety() {
        return seedVariety;
    }

    public void setSeedVariety(SeedVariety seedVariety) {
        this.seedVariety = seedVariety;
    }

    public Integer getSeedsPerCell() {
        return seedsPerCell;
    }

    public void setSeedsPerCell(Integer seedsPerCell) {
        this.seedsPerCell = seedsPerCell;
    }

    public SeedStarter getSeedStarter() {
        return seedStarter;
    }

    public void setSeedStarter(SeedStarter seedStarter) {
        this.seedStarter = seedStarter;
    }

    @Override
    public final boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Row)) return false;

        Row that = (Row) obj;
        // Two new objects are never equal to each other
        return this.getId() != null && that.getId() != null && this.getId().equals(that.getId());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(getId());
    }

}
