package com.eustacio.seedstartermanager.web.exception.support;

import org.springframework.http.HttpStatus;

/**
 * @author Wallison Freitas
 */
public class ApiError {

    private int code;
    private String reason;
    private String error;

    public ApiError(HttpStatus httpStatus, String error) {
        this.code = httpStatus.value();
        this.reason = httpStatus.name();
        this.error = error;
    }

    public int getCode() {
        return code;
    }

    public String getReason() {
        return reason;
    }

    public String getError() {
        return error;
    }

}
