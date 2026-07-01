package com.resourcevault.adapters.out.persistence;

import com.resourcevault.application.port.out.ResourcePersistencePort;
import com.resourcevault.domain.ResourceItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ResourcePersistenceAdapter implements ResourcePersistencePort {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    @Override
    public ResourceItem save(ResourceItem resourceItem) {
        ResourceEntity entity = mapToEntity(resourceItem);
        ResourceEntity saved = resourceRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<ResourceItem> findById(Long id) {
        return resourceRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<ResourceItem> findAll() {
        return resourceRepository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        resourceRepository.deleteById(id);
    }

    private ResourceItem mapToDomain(ResourceEntity entity) {
        return ResourceItem.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .url(entity.getUrl())
                .ownerId(entity.getOwner() != null ? entity.getOwner().getId() : null)
                .tags(entity.getTags())
                .build();
    }

    private ResourceEntity mapToEntity(ResourceItem resourceItem) {
        return ResourceEntity.builder()
                .id(resourceItem.getId())
                .title(resourceItem.getTitle())
                .description(resourceItem.getDescription())
                .url(resourceItem.getUrl())
                .tags(resourceItem.getTags())
                .owner(resourceItem.getOwnerId() != null ? userRepository.findById(resourceItem.getOwnerId()).orElse(null) : null)
                .build();
    }
}
