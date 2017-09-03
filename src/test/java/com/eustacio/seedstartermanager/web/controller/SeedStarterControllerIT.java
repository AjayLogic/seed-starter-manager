package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.WebIntegrationTest;
import com.eustacio.seedstartermanager.domain.Feature;
import com.eustacio.seedstartermanager.domain.MaterialType;
import com.eustacio.seedstartermanager.domain.Row;
import com.eustacio.seedstartermanager.domain.SeedStarter;
import com.eustacio.seedstartermanager.domain.SeedVariety;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.SeedStarterService;
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

import java.time.LocalDate;
import java.time.Month;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
class SeedStarterControllerIT {

    @Autowired
    private SeedStarterService mockService;

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;
    private List<SeedStarter> seedStarterList;

    @BeforeEach
    void beforeEachTest() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();

        SeedStarter seedStarter1 = new SeedStarter(new MaterialType("Vibranium"),
                LocalDate.of(1939, Month.SEPTEMBER, 1), false,
                Lists.newArrayList(new Feature("Immortality"), new Feature("Invincibility")),
                Lists.newArrayList(new Row(new SeedVariety("Aconitum Napellus"), 2)));

        SeedStarter seedStarter2 = new SeedStarter(new MaterialType("Adamantium"),
                LocalDate.of(1945, Month.SEPTEMBER, 2), false,
                Lists.newArrayList(new Feature("Immortality"), new Feature("Invincibility")),
                Lists.newArrayList(new Row(new SeedVariety("Castor Plants"), 1),
                        new Row(new SeedVariety("Aconitum Napellus"), 2)));

        this.seedStarterList = Lists.newArrayList(seedStarter1, seedStarter2);
    }

    @Test
    void getAllSeedStarters() throws Exception {
        when(mockService.findAll()).thenReturn(seedStarterList);
        String jsonContent = convertToJson(seedStarterList);

        mockMvc.perform(get("/seed-starter").accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(jsonContent));
    }

    @Test
    @DisplayName("getAllSeedStarters() should return status 'No Content' when has no SeedStarter")
    void getAllSeedStarters_ShouldReturnStatusNoContent_WhenHasNoSeedStarter() throws Exception {
        when(mockService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/seed-starter"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createOrUpdateSeedStarter() throws Exception {
        SeedStarter newSeedStarter = seedStarterList.get(0);
        setId(999L, newSeedStarter);

        when(mockService.save(newSeedStarter)).thenReturn(newSeedStarter);

        String payload = convertToJson(newSeedStarter);
        String expectedLocation = "/seed-starter/" + newSeedStarter.getId();

        mockMvc.perform(post("/seed-starter").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(header().string(HttpHeaders.LOCATION, Matchers.endsWith(expectedLocation)));
    }

    @Test
    @DisplayName("createOrUpdateSeedStarter() should validate the SeedStarter")
    void createOrUpdateSeedStarter_ShouldValidateTheSeedStarter() throws Exception {
        SeedStarter invalidSeedStarter = new SeedStarter(null, null, false,
                Lists.newArrayList(new Feature("")), Lists.newArrayList(new Row(new SeedVariety(""), 1)));

        String payload = convertToJson(invalidSeedStarter);

        mockMvc.perform(post("/seed-starter").contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.BAD_REQUEST.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.BAD_REQUEST.name())))
                .andExpect(jsonPath("$.fieldErrors.length()", is(greaterThanOrEqualTo(1))));
    }

    @Test
    void findSeedStarterById() throws Exception {
        Long seedStarterId = 123123123123L;
        SeedStarter seedStarter = seedStarterList.get(0);
        setId(seedStarterId, seedStarter);

        String jsonContent = convertToJson(seedStarter);
        when(mockService.findById(seedStarterId)).thenReturn(Optional.of(seedStarter));


        mockMvc.perform(get("/seed-starter/{id}", seedStarterId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(jsonContent));
    }

    @Test
    @DisplayName("findSeedStarterById() should return status 'Not Found' when the SeedStarter not exists")
    void findSeedStarterById_ShouldReturnStatusNotFound_WhenTheSeedStarterNotExists() throws Exception {
        Long seedStarterId = 321321L;

        mockMvc.perform(get("/seed-starter/{id}", seedStarterId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(not(blankOrNullString()))));
    }

    @Test
    void deleteSeedStarter() throws Exception {
        Long seedStarterId = 123L;

        mockMvc.perform(delete("/seed-starter/{id}", seedStarterId))
                .andExpect(status().isOk());

        verify(mockService, atLeastOnce()).delete(seedStarterId);
    }

    @Test
    @DisplayName("deleteSeedStarter() should return status 'Not Found' when the SeedStarter not exists")
    void deleteSeedStarter_ShouldReturnStatusNotFound_WhenTheSeedStarterNotExists() throws Exception {
        SeedStarterController mockController = mock(SeedStarterController.class);
        this.mockMvc = MockMvcBuilders.standaloneSetup(mockController)
                .setControllerAdvice(new RestEndpointExceptionHandler())
                .build();

        Long SeedStarterId = 171L;
        EntityNotFoundException notFoundException = new EntityNotFoundException("Entity not found");
        when(mockController.deleteSeedStarter(SeedStarterId)).thenThrow(notFoundException);


        mockMvc.perform(delete("/seed-starter/{id}", SeedStarterId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.code", is(HttpStatus.NOT_FOUND.value())))
                .andExpect(jsonPath("$.reason", is(HttpStatus.NOT_FOUND.name())))
                .andExpect(jsonPath("$.error", is(equalTo(notFoundException.getMessage()))));
    }


    @Configuration
    static class TestConfig {

        @Bean
        public SeedStarterService mockSeedStarterService() {
            return mock(SeedStarterService.class);
        }
    }

}
