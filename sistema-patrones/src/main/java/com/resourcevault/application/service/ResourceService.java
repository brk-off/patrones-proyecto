package com.resourcevault.application.service;

import com.resourcevault.application.port.in.ResourceUseCase;
import com.resourcevault.application.port.out.ResourcePersistencePort;
import com.resourcevault.domain.ResourceItem;
import com.resourcevault.domain.strategy.OwnerFilterStrategy;
import com.resourcevault.domain.strategy.ResourceFilterStrategy;
import com.resourcevault.domain.strategy.TagFilterStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ResourceService implements ResourceUseCase {

    private final ResourcePersistencePort resourcePersistencePort;

    @Override
    public ResourceItem createResource(ResourceItem resourceItem) {
        return resourcePersistencePort.save(resourceItem);
    }

    @Override
    public java.util.Optional<ResourceItem> getResourceById(Long id) {
        return resourcePersistencePort.findById(id);
    }

    @Override
    public List<ResourceItem> getResources(String tag, String ownerId) {
        List<ResourceItem> resources = resourcePersistencePort.findAll();
        ResourceFilterStrategy strategy = selectStrategy(tag, ownerId);
        if (strategy == null) {
            return resources;
        }
        String filterValue = tag != null && !tag.isBlank() ? tag : ownerId;
        return strategy.filter(resources, filterValue);
    }

    private ResourceFilterStrategy selectStrategy(String tag, String ownerId) {
        if (tag != null && !tag.isBlank()) {
            return new TagFilterStrategy();
        }
        if (ownerId != null && !ownerId.isBlank()) {
            return new OwnerFilterStrategy();
        }
        return null;
    }

    @Override
    public ResourceItem updateResource(Long id, ResourceItem resourceItem) {
        ResourceItem existing = resourcePersistencePort.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
        existing.setTitle(resourceItem.getTitle());
        existing.setDescription(resourceItem.getDescription());
        existing.setUrl(resourceItem.getUrl());
        existing.setOwnerId(resourceItem.getOwnerId());
        existing.setTags(resourceItem.getTags());
        return resourcePersistencePort.save(existing);
    }

    @Override
    public void deleteResource(Long id) {
        resourcePersistencePort.deleteById(id);
    }
}
