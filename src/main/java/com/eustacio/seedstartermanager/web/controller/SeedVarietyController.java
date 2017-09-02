package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.domain.SeedVariety;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.SeedVarietyService;
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
@RequestMapping(path = "variety", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class SeedVarietyController {

    private SeedVarietyService seedVarietyService;

    @Autowired
    public SeedVarietyController(SeedVarietyService seedVarietyService) {
        this.seedVarietyService = seedVarietyService;
    }

    @GetMapping
    public ResponseEntity getAllVarieties() {
        List<SeedVariety> seedVarietyList = seedVarietyService.findAll();
        if (seedVarietyList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(seedVarietyList);
    }

    @PostMapping
    public ResponseEntity createOrUpdateVariety(@Valid @RequestBody SeedVariety seedVariety,
                                                Errors errors, UriComponentsBuilder uriBuilder) {
        if (errors.hasErrors()) {
            ValidationError validationError = new ValidationError(HttpStatus.BAD_REQUEST, mapToFieldError(errors));
            return ResponseEntity.badRequest().body(validationError);
        }

        SeedVariety newVariety = seedVarietyService.save(seedVariety);
        URI location = uriBuilder.path("/variety/{id}").build(newVariety.getId());
        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity findVarietyById(@PathVariable("id") Long id) {
        SeedVariety seedVariety = seedVarietyService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cannot find SeedVariety with id " + id));

        return ResponseEntity.ok(seedVariety);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteVariety(@PathVariable("id") Long id) {
        seedVarietyService.delete(id);
        return ResponseEntity.ok().build();
    }

}
