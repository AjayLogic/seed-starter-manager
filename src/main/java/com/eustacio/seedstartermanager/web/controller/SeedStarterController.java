package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.domain.SeedStarter;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.SeedStarterService;
import com.eustacio.seedstartermanager.web.exception.support.ValidationError;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import static com.eustacio.seedstartermanager.web.WebUtility.mapToFieldError;

/**
 * @author Wallison Freitas
 */
@RestController
@RequestMapping(path = "seed-starter", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class SeedStarterController {

    private SeedStarterService seedStarterService;

    @Autowired
    public SeedStarterController(SeedStarterService seedStarterService) {
        this.seedStarterService = seedStarterService;
    }

    @GetMapping
    public ResponseEntity getAllSeedStarters() {
        List<SeedStarter> seedStarterList = seedStarterService.findAll();
        if (seedStarterList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(seedStarterList);
    }

    @PostMapping
    public ResponseEntity createOrUpdateSeedStarter(@Valid @RequestBody SeedStarter seedStarter,
                                                    Errors errors, UriComponentsBuilder uriBuilder) {
        if (errors.hasErrors()) {
            ValidationError validationError = new ValidationError(HttpStatus.BAD_REQUEST, mapToFieldError(errors));
            return ResponseEntity.badRequest().body(validationError);
        }

        SeedStarter newSeedStarter = seedStarterService.save(seedStarter);
        URI location = uriBuilder.path("/seed-starter/{id}").build(newSeedStarter.getId());
        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity findSeedStarterById(@PathVariable("id") Long id) {
        SeedStarter seedStarter = seedStarterService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cannot find SeedStarter with id " + id));

        return ResponseEntity.ok(seedStarter);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteSeedStarter(@PathVariable("id") Long id) {
        seedStarterService.delete(id);
        return ResponseEntity.ok().build();
    }

}
