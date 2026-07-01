package com.resourcevault.web.controller;

import com.resourcevault.application.port.in.ResourceUseCase;
import com.resourcevault.domain.ResourceItem;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceUseCase resourceUseCase;

    @GetMapping
    public ResponseEntity<List<ResourceItem>> getResources(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String ownerId) {
        return ResponseEntity.ok(resourceUseCase.getResources(tag, ownerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceItem> getResourceById(@PathVariable Long id) {
        return resourceUseCase.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ResourceItem> createResource(@RequestBody ResourceItem resourceItem) {
        ResourceItem created = resourceUseCase.createResource(resourceItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceItem> updateResource(@PathVariable Long id, @RequestBody ResourceItem resourceItem) {
        try {
            ResourceItem updated = resourceUseCase.updateResource(id, resourceItem);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceUseCase.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
