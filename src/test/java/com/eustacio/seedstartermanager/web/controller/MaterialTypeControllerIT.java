package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.WebIntegrationTest;
import com.eustacio.seedstartermanager.domain.MaterialType;
import com.eustacio.seedstartermanager.domain.NamedEntity;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.MaterialTypeService;
import com.eustacio.seedstartermanager.web.exception.RestEndpointExceptionHandler;

import org.assertj.core.util.Lists;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
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
class MaterialTypeControllerIT {

    @Autowired
    private MaterialTypeService mockService;

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;
    private List<MaterialType> materialTypeList;

    @BeforeEach
    void beforeEachTest() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        MaterialType vibranium = new MaterialType("Vibranium");
        MaterialType adamantium = new MaterialType("Adamantium");
        this.materialTypeList = Lists.newArrayList(vibranium, adamantium);
    }


    @Test
    void getAllMaterials() throws Exception {
        when(mockService.findAll()).thenReturn(materialTypeList);
        List<String> allMaterialNames = materialTypeList.stream()
                .map(NamedEntity::getName)
                .collect(Collectors.toList());

        mockMvc.perform(get("/material").accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$..name", is(equalTo(allMaterialNames))));
    }

    @Test
    @DisplayName("getAllMaterials() should return status 'No Content' when has no MaterialType")
    void getAllMaterials_ShouldReturnStatusNoContent_WhenHasNoMaterialType() throws Exception {
        when(mockService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/material"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createOrUpdateMaterial_ShouldReturnStatusOk_WhenMaterialTypeExistsAndIsUpdated() throws Exception {
        Long materialId = 321L;

        MaterialType newMaterialType = new MaterialType("Antimatter");
        setId(materialId, newMaterialType);

        MaterialType updatedMaterialType = new MaterialType(newMaterialType.getName());
        setId(materialId, updatedMaterialType);

        String expectedLocation = "/material/" + materialId;

        when(mockService.save(newMaterialType)).thenReturn(updatedMaterialType);

        String payload = convertToJson(newMaterialType);

        mockMvc.perform(post("/material").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.LOCATION, Matchers.endsWith(expectedLocation)))
                .andExpect(jsonPath("$.id", is(equalTo(materialId.intValue()))))
                .andExpect(jsonPath("$.name", is(equalTo(updatedMaterialType.getName()))));
    }

    @Test
    void createOrUpdateMaterial_ShouldReturnStatusCreated_WhenMaterialTypeIsNew() throws Exception {
        MaterialType newMaterialType = new MaterialType("Californium");

        Long materialId = 123123321L;
        MaterialType savedMaterialType = new MaterialType(newMaterialType.getName());
        setId(materialId, savedMaterialType);

        String expectedLocation = "/material/" + materialId;

        when(mockService.save(newMaterialType)).thenReturn(savedMaterialType);

        String payload = convertToJson(newMaterialType);

        mockMvc.perform(post("/material").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(header().string(HttpHeaders.LOCATION, Matchers.endsWith(expectedLocation)))
                .andExpect(jsonPath("$.id", is(equalTo(materialId.intValue()))))
                .andExpect(jsonPath("$.name", is(equalTo(savedMaterialType.getName()))));
    }

    @Test
    @DisplayName("createOrUpdateMaterial() should validate the MaterialType")
    void createOrUpdateMaterial_ShouldValidateTheMaterialType() throws Exception {
        MaterialType invalidMaterialType = new MaterialType("");
        String payload = convertToJson(invalidMaterialType);

        mockMvc.perform(post("/material").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.BAD_REQUEST.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.BAD_REQUEST.name())))
                .andExpect(jsonPath("$.fieldErrors.length()", is(greaterThanOrEqualTo(1))));
    }

    @Test
    void findMaterialTypeById() throws Exception {
        Long materialTypeId = 999999999999L;
        MaterialType material = new MaterialType("Antimatter");
        setId(materialTypeId, material);

        when(mockService.findById(materialTypeId)).thenReturn(Optional.of(material));


        mockMvc.perform(get("/material/{id}", materialTypeId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.id", is(equalTo(materialTypeId))))
                .andExpect(jsonPath("$.name", is(equalTo(material.getName()))));
    }

    @Test
    @DisplayName("findMaterialById() should return status 'Not Found' when the MaterialType not exists")
    void findMaterialById_ShouldReturnStatusNotFound_WhenTheMaterialTypeNotExists() throws Exception {
        Long materialTypeId = 987L;

        mockMvc.perform(get("/material/{id}", materialTypeId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(not(blankOrNullString()))));
    }

    @Test
    void deleteMaterial() throws Exception {
        mockMvc.perform(delete("/material/{id}", 777L))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("deleteMaterial() should return status 'Not Found' when the MaterialType not exists")
    void deleteMaterial_ShouldReturnStatusNotFound_WhenTheMaterialTypeNotExists() throws Exception {
        MaterialTypeController mockController = mock(MaterialTypeController.class);
        this.mockMvc = MockMvcBuilders.standaloneSetup(mockController)
                .setControllerAdvice(new RestEndpointExceptionHandler())
                .build();

        Long materialTypeId = 70L;
        EntityNotFoundException notFoundException = new EntityNotFoundException("Entity not found");
        when(mockController.deleteMaterial(materialTypeId)).thenThrow(notFoundException);


        mockMvc.perform(delete("/material/{id}", materialTypeId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(equalTo(notFoundException.getMessage()))));
    }


    @Configuration
    static class TestConfig {

        @Bean
        public MaterialTypeService mockMaterialTypeService() {
            return mock(MaterialTypeService.class);
        }
    }

}