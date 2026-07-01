package com.resourcevault.domain.strategy;

import com.resourcevault.domain.ResourceItem;

import java.util.List;
import java.util.stream.Collectors;

public class TagFilterStrategy implements ResourceFilterStrategy {

    @Override
    public List<ResourceItem> filter(List<ResourceItem> resources, String filterValue) {
        if (filterValue == null || filterValue.isBlank()) return resources;

        String lowerTag = filterValue.toLowerCase();
        return resources.stream()
                .filter(resource -> resource.getTags() != null && resource.getTags().stream()
                        .anyMatch(tag -> tag.toLowerCase().contains(lowerTag)))
                .toList();
    }
}
