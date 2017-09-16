package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.domain.Feature;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.FeatureService;
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
@RequestMapping(path = "feature", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class FeatureController {

    private FeatureService featureService;

    @Autowired
    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public ResponseEntity getAllFeatures() {
        List<Feature> featureList = featureService.findAll();
        if (featureList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(featureList);
    }

    @PostMapping
    public ResponseEntity createOrUpdateFeature(@Valid @RequestBody Feature feature,
                                                Errors errors, UriComponentsBuilder uriBuilder) {
        if (errors.hasErrors()) {
            ValidationError validationError = new ValidationError(HttpStatus.BAD_REQUEST, mapToFieldError(errors));
            return ResponseEntity.badRequest().body(validationError);
        }

        Feature newFeature = featureService.save(feature);
        URI location = uriBuilder.path("/feature/{id}").build(newFeature.getId());
        return ResponseEntity.created(location).body(newFeature);
    }

    @GetMapping("/{id}")
    public ResponseEntity findFeatureById(@PathVariable("id") Long id) {
        Feature feature = featureService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cannot find Feature with id " + id));

        return ResponseEntity.ok(feature);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteFeature(@PathVariable("id") Long id) {
        featureService.delete(id);
        return ResponseEntity.ok().build();
    }

}
