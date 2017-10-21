package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.WebIntegrationTest;
import com.eustacio.seedstartermanager.domain.NamedEntity;
import com.eustacio.seedstartermanager.domain.SeedVariety;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.SeedVarietyService;
import com.eustacio.seedstartermanager.web.exception.RestEndpointExceptionHandler;
import com.eustacio.seedstartermanager.web.storageManager.ServerStorageManager;

import org.assertj.core.util.Lists;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.eustacio.seedstartermanager.TestUtil.convertToJson;
import static com.eustacio.seedstartermanager.TestUtil.setId;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * @author Wallison Freitas
 */
@WebIntegrationTest
class SeedVarietyControllerIT {

    @Autowired
    private SeedVarietyService mockService;

    @Autowired
    private ServerStorageManager mockServerStorageManager;

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;
    private List<SeedVariety> seedVarietyList;

    @BeforeEach
    void beforeEachTest() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        SeedVariety aconitumNapellus = new SeedVariety("Aconitum Napellus");
        SeedVariety castorPlants = new SeedVariety("Castor Plants");
        this.seedVarietyList = Lists.newArrayList(aconitumNapellus, castorPlants);
    }

    @Test
    void getAllVarieties() throws Exception {
        when(mockService.findAll()).thenReturn(seedVarietyList);
        List<String> allVarietyNames = seedVarietyList.stream()
                .map(NamedEntity::getName)
                .collect(Collectors.toList());

        mockMvc.perform(get("/variety").accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$..name", is(equalTo(allVarietyNames))));
    }

    @Test
    @DisplayName("getAllVarieties() should return status 'No Content' when has no SeedVariety")
    void getAllVarieties_ShouldReturnStatusNoContent_WhenHasNoSeedVariety() throws Exception {
        when(mockService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/variety"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createOrUpdateVariety() throws Exception {
        SeedVariety newVariety = new SeedVariety("Belladonna");
        String payload = convertToJson(newVariety);

        File savedImageFile = new File("belladonna.jpg");

        SeedVariety savedVariety = new SeedVariety(newVariety.getName());
        savedVariety.setImageName(savedImageFile.getName());
        setId(345L, savedVariety);

        String expectedLocation = "/variety/" + savedVariety.getId();

        when(mockService.save(newVariety)).thenReturn(savedVariety);
        when(mockServerStorageManager.transferFileToServer(any(), any())).thenReturn(savedImageFile);


        mockMvc.perform(multipart("/variety")
                .file(new MockMultipartFile("seed-variety-image", "belladonna.jpg", "image/jpeg", new byte[]{1, 2, 3}))
                .file(new MockMultipartFile("seed-variety", "blob", "application/json", payload.getBytes()))
        )
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(header().string(HttpHeaders.LOCATION, Matchers.endsWith(expectedLocation)))
                .andExpect(jsonPath("$.id", is(equalTo(savedVariety.getId().intValue()))))
                .andExpect(jsonPath("$.name", is(equalTo(savedVariety.getName()))))
                .andExpect(jsonPath("$.imageName", is(equalTo(savedImageFile.getName()))));
    }

    @Test
    @DisplayName("createOrUpdateVariety() should validate the SeedVariety")
    void createOrUpdateVariety_ShouldValidateTheSeedVariety() throws Exception {
        SeedVariety invalidSeedVariety = new SeedVariety("");
        String payload = convertToJson(invalidSeedVariety);

        mockMvc.perform(multipart("/variety")
                .file(new MockMultipartFile("seed-variety", "blob", "application/json", payload.getBytes()))
        )
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.BAD_REQUEST.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.BAD_REQUEST.name())))
                .andExpect(jsonPath("$.fieldErrors.length()", is(greaterThanOrEqualTo(1))));
    }

    @Test
    void findVarietyById() throws Exception {
        Long SeedVarietyId = 6666666666L;
        SeedVariety variety = new SeedVariety("Rosary Pea");
        setId(SeedVarietyId, variety);

        when(mockService.findById(SeedVarietyId)).thenReturn(Optional.of(variety));


        mockMvc.perform(get("/variety/{id}", SeedVarietyId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.id", is(equalTo(SeedVarietyId))))
                .andExpect(jsonPath("$.name", is(equalTo(variety.getName()))));
    }

    @Test
    @DisplayName("findVarietyById() should return status 'Not Found' when the SeedVariety not exists")
    void findVarietyById_ShouldReturnStatusNotFound_WhenTheSeedVarietyNotExists() throws Exception {
        Long seedVarietyId = 54321L;

        mockMvc.perform(get("/variety/{id}", seedVarietyId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(not(blankOrNullString()))));
    }

    @Test
    void deleteVariety() throws Exception {
        mockMvc.perform(delete("/variety/{id}", 789L))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("deleteVariety() should return status 'Not Found' when the SeedVariety not exists")
    void deleteVariety_ShouldReturnStatusNotFound_WhenTheSeedVarietyNotExists() throws Exception {
        SeedVarietyController mockController = mock(SeedVarietyController.class);
        this.mockMvc = MockMvcBuilders.standaloneSetup(mockController)
                .setControllerAdvice(new RestEndpointExceptionHandler())
                .build();

        Long seedVarietyId = 27L;
        EntityNotFoundException notFoundException = new EntityNotFoundException("Entity not found");
        when(mockController.deleteVariety(seedVarietyId)).thenThrow(notFoundException);


        mockMvc.perform(delete("/variety/{id}", seedVarietyId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(equalTo(notFoundException.getMessage()))));
    }


    @Configuration
    static class TestConfig {

        @Bean
        public SeedVarietyService mockSeedVarietyService() {
            return mock(SeedVarietyService.class);
        }

        @Bean
        @Primary
        public ServerStorageManager mockServerStorageManager() {
            return mock(ServerStorageManager.class);
        }
    }

}
