package com.resourcevault.application.port.in;

import com.resourcevault.domain.ResourceItem;

import java.util.List;
import java.util.Optional;

public interface ResourceUseCase {
    ResourceItem createResource(ResourceItem resourceItem);
    Optional<ResourceItem> getResourceById(Long id);
    List<ResourceItem> getResources(String tag, String ownerId);
    ResourceItem updateResource(Long id, ResourceItem resourceItem);
    void deleteResource(Long id);
}
