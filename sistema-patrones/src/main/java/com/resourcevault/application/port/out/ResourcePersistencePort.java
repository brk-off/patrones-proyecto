package com.resourcevault.application.port.out;

import com.resourcevault.domain.ResourceItem;

import java.util.List;
import java.util.Optional;

public interface ResourcePersistencePort {
    ResourceItem save(ResourceItem resourceItem);
    Optional<ResourceItem> findById(Long id);
    List<ResourceItem> findAll();
    void deleteById(Long id);
}
