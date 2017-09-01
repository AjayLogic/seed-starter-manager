package com.eustacio.seedstartermanager.web.exception.support;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Wallison Freitas
 */
public class ValidationError extends ApiError {

    private List<FieldError> fieldErrors;

    public ValidationError(HttpStatus httpStatus, Iterable<FieldError> fieldErrors) {
        this(httpStatus, "Validation failed", fieldErrors);
    }

    public ValidationError(HttpStatus httpStatus, String error, Iterable<FieldError> fieldErrors) {
        super(httpStatus, error);

        this.fieldErrors = new ArrayList<>();
        fieldErrors.forEach(this.fieldErrors::add);
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }

}
