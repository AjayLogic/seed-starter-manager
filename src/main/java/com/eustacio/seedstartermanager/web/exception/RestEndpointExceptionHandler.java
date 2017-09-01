package com.eustacio.seedstartermanager.web.exception;

import com.eustacio.seedstartermanager.exception.DuplicateNameException;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.web.exception.support.ApiError;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @author Wallison Freitas
 */
@RestControllerAdvice
public class RestEndpointExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<ApiError> handleDuplicateNameException(DuplicateNameException exception) {
        return getResponseEntityOfApiError(HttpStatus.CONFLICT, exception);
    }

    @ExceptionHandler
    public ResponseEntity<ApiError> handleEntityNotFoundException(EntityNotFoundException exception) {
        return getResponseEntityOfApiError(HttpStatus.NOT_FOUND, exception);
    }

    private ResponseEntity<ApiError> getResponseEntityOfApiError(HttpStatus httpStatus, RuntimeException error) {
        ApiError apiError = new ApiError(httpStatus, error.getMessage());
        return ResponseEntity.status(httpStatus).body(apiError);
    }

}
