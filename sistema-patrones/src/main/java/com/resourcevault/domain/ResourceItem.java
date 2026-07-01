package com.resourcevault.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceItem {
    private Long id;
    private String title;
    private String description;
    private String url;
    private Long ownerId;
    private List<String> tags;
}
