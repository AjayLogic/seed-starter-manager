package com.eustacio.seedstartermanager.exception;

/**
 * @author Wallison Freitas
 */
public class DuplicateNameException extends RuntimeException {

    public DuplicateNameException(String message) {
        super(message);
    }

    public DuplicateNameException(String message, Throwable cause) {
        super(message, cause);
    }

}
