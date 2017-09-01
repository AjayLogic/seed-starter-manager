package com.eustacio.seedstartermanager;

import com.eustacio.seedstartermanager.domain.Entity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.test.util.ReflectionTestUtils;

/**
 * @author Wallison Freitas
 */
public abstract class TestUtil {

    public static <T extends Entity> void setId(Long id, T entity) {
        ReflectionTestUtils.setField(entity, "id", id);
    }

    public static String convertToJson(Object obj) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(obj);
    }

}
