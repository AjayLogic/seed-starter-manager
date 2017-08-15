package com.eustacio.seedstartermanager.domain;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * @author Wallison Freitas
 */
@MappedSuperclass
public abstract class NamedEntity extends Entity {

    public static final int MIN_NAME_LENGTH = 1;
    public static final int MAX_NAME_LENGTH = 50;

    @NotBlank
    @Size(min = MIN_NAME_LENGTH, max = MAX_NAME_LENGTH)
    @Column(name = "NAME", unique = true, nullable = false, length = MAX_NAME_LENGTH)
    private String name;

    protected NamedEntity() {
        // Constructor without arguments to allow subclasses to have a no-args constructor to agree
        // with the JPA specification
    }

    public NamedEntity(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NamedEntity)) return false;

        NamedEntity that = (NamedEntity) o;
        return this.getName() == null ? that.getName() == null :
                this.getName().equalsIgnoreCase(that.getName());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(getName());
    }

    @Override
    public String toString() {
        return name;
    }

}
