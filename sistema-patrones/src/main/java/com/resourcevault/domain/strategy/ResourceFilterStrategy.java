package com.resourcevault.domain.strategy;

import com.resourcevault.domain.ResourceItem;

import java.util.List;

public interface ResourceFilterStrategy {
    List<ResourceItem> filter(List<ResourceItem> resources, String filterValue);
}
