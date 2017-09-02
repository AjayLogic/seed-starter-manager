package com.eustacio.seedstartermanager.web.controller;

import com.eustacio.seedstartermanager.domain.MaterialType;
import com.eustacio.seedstartermanager.exception.EntityNotFoundException;
import com.eustacio.seedstartermanager.service.MaterialTypeService;
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
@RequestMapping(path = "material", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class MaterialTypeController {

    private MaterialTypeService materialTypeService;

    @Autowired
    public MaterialTypeController(MaterialTypeService materialTypeService) {
        this.materialTypeService = materialTypeService;
    }

    @GetMapping
    public ResponseEntity getAllMaterials() {
        List<MaterialType> materialTypeList = materialTypeService.findAll();
        if (materialTypeList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(materialTypeList);
    }

    @PostMapping
    public ResponseEntity createOrUpdateMaterial(@Valid @RequestBody MaterialType materialType,
                                                 Errors errors, UriComponentsBuilder uriBuilder) {
        if (errors.hasErrors()) {
            ValidationError validationError = new ValidationError(HttpStatus.BAD_REQUEST, mapToFieldError(errors));
            return ResponseEntity.badRequest().body(validationError);
        }

        MaterialType newMaterial = materialTypeService.save(materialType);
        URI location = uriBuilder.path("/material/{id}").build(newMaterial.getId());
        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity findMaterialById(@PathVariable("id") Long id) {
        MaterialType materialType = materialTypeService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cannot find MaterialType with id " + id));

        return ResponseEntity.ok(materialType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteMaterial(@PathVariable("id") Long id) {
        materialTypeService.delete(id);
        return ResponseEntity.ok().build();
    }

}
