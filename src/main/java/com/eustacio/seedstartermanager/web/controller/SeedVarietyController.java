package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.domain.SeedVariety;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.SeedVarietyService;
import com.eustacio.seedstartermanager.web.exception.support.ValidationError;
import com.eustacio.seedstartermanager.web.storageManager.ServerStorageManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
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
    private ServerStorageManager serverStorageManager;

    @Autowired
    public SeedVarietyController(SeedVarietyService seedVarietyService, ServerStorageManager serverStorageManager) {
        this.seedVarietyService = seedVarietyService;
        this.serverStorageManager = serverStorageManager;
    }

    @GetMapping
    public ResponseEntity getAllVarieties() {
        List<SeedVariety> seedVarietyList = seedVarietyService.findAll();
        if (seedVarietyList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(seedVarietyList);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity createOrUpdateVariety(@RequestPart(name = "seed-variety-image", required = false) MultipartFile imageFile,
                                                @Valid @RequestPart("seed-variety") SeedVariety seedVariety,
                                                Errors errors, UriComponentsBuilder uriBuilder) {
        if (errors.hasErrors()) {
            ValidationError validationError = new ValidationError(HttpStatus.BAD_REQUEST, mapToFieldError(errors));
            return ResponseEntity.badRequest().body(validationError);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            // Uses the same seed variety name as the image filename
            File savedImageFile = serverStorageManager.transferFileToServer(imageFile, seedVariety.getName());
            if (savedImageFile != null) {
                seedVariety.setImageName(savedImageFile.getName());
            }
        }

        boolean isNewSeedVariety = seedVariety.getId() == null;

        SeedVariety newSeedVariety = seedVarietyService.save(seedVariety);
        URI location = uriBuilder.path("/variety/{id}").build(newSeedVariety.getId());

        if (isNewSeedVariety) {
            return ResponseEntity.created(location).body(newSeedVariety);
        }

        return ResponseEntity.ok().location(location).body(newSeedVariety);
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
