package com.resourcevault.domain.strategy;

import com.resourcevault.domain.ResourceItem;

import java.util.List;
import java.util.stream.Collectors;

public class OwnerFilterStrategy implements ResourceFilterStrategy {

    @Override
    public List<ResourceItem> filter(List<ResourceItem> resources, String filterValue) {
        if (filterValue == null || filterValue.isBlank()) return resources;

        Long ownerId = Long.valueOf(filterValue);
        return resources.stream()
                .filter(resource -> ownerId.equals(resource.getOwnerId()))
                .toList();
    }
}
