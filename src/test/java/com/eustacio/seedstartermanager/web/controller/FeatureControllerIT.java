package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.WebIntegrationTest;
import com.eustacio.seedstartermanager.domain.Feature;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.FeatureService;
import com.eustacio.seedstartermanager.web.exception.RestEndpointExceptionHandler;

import org.assertj.core.util.Lists;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.eustacio.seedstartermanager.TestUtil.convertToJson;
import static com.eustacio.seedstartermanager.TestUtil.setId;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * @author Wallison Freitas
 */
@WebIntegrationTest
class FeatureControllerIT {

    @Autowired
    private FeatureService mockService;

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;
    private List<Feature> featureList;

    @BeforeEach
    void beforeEachTest() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        Feature specificSubstrate = new Feature("Specific Substrate");
        Feature fertilizer = new Feature("Fertilizer");
        this.featureList = Lists.newArrayList(specificSubstrate, fertilizer);
    }

    @Test
    void getAllFeatures() throws Exception {
        when(mockService.findAll()).thenReturn(featureList);
        List<String> allFeatureNames = featureList.stream()
                .map(Feature::getName)
                .collect(Collectors.toList());

        mockMvc.perform(get("/feature").accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$..name", is(equalTo(allFeatureNames))));
    }

    @Test
    @DisplayName("getAllFeatures() should return status 'No Content' when has no Feature")
    void getAllFeatures_ShouldReturnStatusNoContent_WhenHasNoFeature() throws Exception {
        when(mockService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/feature"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createOrUpdateFeature_ShouldReturnStatusOk_WhenFeatureExistsAndIsUpdated() throws Exception {
        Long featureId = 666L;

        Feature newFeature = new Feature("Invincibility");
        setId(featureId, newFeature);

        Feature updatedFeature = new Feature(newFeature.getName());
        setId(featureId, updatedFeature);

        String expectedLocation = "/feature/" + featureId;

        when(mockService.save(newFeature)).thenReturn(updatedFeature);

        String payload = convertToJson(newFeature);

        mockMvc.perform(post("/feature").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.LOCATION, Matchers.endsWith(expectedLocation)))
                .andExpect(jsonPath("$.id", is(equalTo(featureId.intValue()))))
                .andExpect(jsonPath("$.name", is(equalTo(updatedFeature.getName()))));
    }

    @Test
    void createOrUpdateFeature_ShouldReturnStatusCreated_WhenFeatureIsNew() throws Exception {
        Feature newFeature = new Feature("Invisibility");

        Long featureId = 123L;
        Feature savedFeature = new Feature(newFeature.getName());
        setId(featureId, savedFeature);

        String expectedLocation = "/feature/" + featureId;

        when(mockService.save(newFeature)).thenReturn(savedFeature);

        String payload = convertToJson(newFeature);

        mockMvc.perform(post("/feature").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(header().string(HttpHeaders.LOCATION, Matchers.endsWith(expectedLocation)))
                .andExpect(jsonPath("$.id", is(equalTo(featureId.intValue()))))
                .andExpect(jsonPath("$.name", is(equalTo(savedFeature.getName()))));
    }

    @Test
    @DisplayName("createOrUpdateFeature() should validate the Feature")
    void createOrUpdateFeature_ShouldValidateTheFeature() throws Exception {
        Feature invalidFeature = new Feature("");
        String payload = convertToJson(invalidFeature);

        mockMvc.perform(post("/feature").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is(HttpStatus.BAD_REQUEST.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.BAD_REQUEST.name())))
                .andExpect(jsonPath("$.fieldErrors.length()", is(greaterThanOrEqualTo(1))));
    }

    @Test
    void deleteFeature() throws Exception {
        mockMvc.perform(delete("/feature/{id}", 6L))
                .andExpect(status().isOk());
    }

    @Test
    void findFeatureById() throws Exception {
        Long featureId = 640509040147L;
        Feature feature = new Feature("immortality");
        setId(featureId, feature);

        when(mockService.findById(featureId)).thenReturn(Optional.of(feature));


        mockMvc.perform(get("/feature/{id}", featureId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(equalTo(featureId))))
                .andExpect(jsonPath("$.name", is(equalTo(feature.getName()))));
    }

    @Test
    @DisplayName("findFeatureById() should return status 'Not Found' when the Feature not exists")
    void findFeatureById_ShouldReturnStatusNotFound_WhenTheFeatureNotExists() throws Exception {
        Long featureId = 69L;

        mockMvc.perform(get("/feature/{id}", featureId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(not(blankOrNullString()))));
    }

    @Test
    @DisplayName("deleteFeature() should return status 'Not Found' when the Feature not exists")
    void deleteFeature_ShouldReturnStatusNotFound_WhenTheFeatureNotExists() throws Exception {
        FeatureController mockController = mock(FeatureController.class);
        this.mockMvc = MockMvcBuilders.standaloneSetup(mockController)
                .setControllerAdvice(new RestEndpointExceptionHandler())
                .build();

        Long featureId = 666L;
        EntityNotFoundException notFoundException = new EntityNotFoundException("Entity not found");
        when(mockController.deleteFeature(featureId)).thenThrow(notFoundException);


        mockMvc.perform(delete("/feature/{id}", featureId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(equalTo(notFoundException.getMessage()))));
    }


    @Configuration
    static class TestConfig {

        @Bean
        FeatureService mockFeatureService() {
            return Mockito.mock(FeatureService.class);
        }
    }

}
