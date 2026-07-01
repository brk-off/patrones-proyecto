package com.resourcevault.domain.factory;

import com.resourcevault.domain.ResourceItem;
import com.resourcevault.domain.User;

public class DomainFactory {

    private DomainFactory() {}

    public static User createUser(Long id, String username, String email, User.Role role) {
        return User.builder()
                .id(id)
                .username(username)
                .email(email)
                .role(role)
                .build();
    }

    public static ResourceItem createResourceItem(Long id, String title, String description, String url, Long ownerId, java.util.List<String> tags) {
        return ResourceItem.builder()
                .id(id)
                .title(title)
                .description(description)
                .url(url)
                .ownerId(ownerId)
                .tags(tags)
                .build();
    }
}
