package com.eustacio.seedstartermanager.domain;

import java.time.LocalDate;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * @author Wallison Freitas
 */
@javax.persistence.Entity
@Table(name = "SEED_STARTER")
public class SeedStarter extends Entity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "MATERIAL_TYPE_ID", nullable = false)
    private MaterialType materialType;

    @Column(name = "DATE_PLANTED", nullable = false)
    private LocalDate datePlanted;

    @Column(name = "COVERED")
    private boolean isCovered;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "SEED_STARTER_FEATURE",
            joinColumns = @JoinColumn(name = "SEED_STARTER_ID", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "FEATURE_ID", nullable = false))
    private Set<Feature> features;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "seedStarter", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Row> rows;

    protected SeedStarter() {
        // Constructor without arguments to agree with the JPA specification
    }

    public SeedStarter(MaterialType materialType, LocalDate datePlanted, boolean isCovered) {
        this(materialType, datePlanted, isCovered, new LinkedHashSet<>(), new LinkedHashSet<>());
    }

    public SeedStarter(MaterialType materialType, LocalDate datePlanted,
                       boolean isCovered, Iterable<Feature> features, Iterable<Row> rows) {
        this.materialType = materialType;
        this.datePlanted = datePlanted;
        this.isCovered = isCovered;
        this.addFeatures(features);
        this.addRows(rows);
    }

    public MaterialType getMaterialType() {
        return materialType;
    }

    public void setMaterialType(MaterialType materialType) {
        this.materialType = materialType;
    }

    public LocalDate getDatePlanted() {
        return datePlanted;
    }

    public void setDatePlanted(LocalDate datePlanted) {
        this.datePlanted = datePlanted;
    }

    public boolean isCovered() {
        return isCovered;
    }

    public void setCovered(boolean covered) {
        isCovered = covered;
    }

    public Set<Feature> getFeatures() {
        return Collections.unmodifiableSet(features);
    }

    public void addFeatures(Iterable<Feature> features) {
        features.forEach(this::addFeature);
    }

    private void addFeature(Feature feature) {
        if (features == null) {
            features = new LinkedHashSet<>();
        }

        features.add(feature);
    }

    public Set<Row> getRows() {
        return Collections.unmodifiableSet(rows);
    }

    public void removeRow(Row row) {
        rows.remove(row);
    }

    public void addRows(Iterable<Row> rows) {
        rows.forEach(this::addRow);
    }

    public void addRow(Row row) {
        if (rows == null) {
            rows = new LinkedHashSet<>();
        }

        row.setSeedStarter(this);
        rows.add(row);
    }

    @Override
    public final boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof SeedStarter)) return false;

        SeedStarter that = (SeedStarter) obj;
        // Two new objects are never equal to each other
        return this.getId() != null && that.getId() != null && this.getId().equals(that.getId());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(getId());
    }

}
