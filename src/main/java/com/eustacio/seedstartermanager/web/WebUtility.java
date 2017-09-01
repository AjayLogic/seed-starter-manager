package com.eustacio.seedstartermanager.web;

import com.eustacio.seedstartermanager.web.exception.support.FieldError;

import org.springframework.validation.Errors;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * @author Wallison Freitas
 */
public abstract class WebUtility {

    public static Collection<FieldError> mapToFieldError(Errors errors) {
        return errors.getFieldErrors()
                .stream()
                .map(fieldError -> new FieldError(fieldError.getField(), fieldError.getDefaultMessage()))
                .collect(Collectors.toList());
    }

}
