package com.resourcevault.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resourcevault.domain.User;
import com.resourcevault.domain.ResourceItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateAndReadUser() throws Exception {
        User user = User.builder()
                .username("testuser")
                .email("testuser@example.com")
                .role(User.Role.USER)
                .build();

        String userJson = objectMapper.writeValueAsString(user);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void shouldCreateAndReadResource() throws Exception {
        User user = User.builder()
                .username("resourceowner")
                .email("owner@example.com")
                .role(User.Role.USER)
                .build();

        String createdUser = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        User savedUser = objectMapper.readValue(createdUser, User.class);

        ResourceItem resource = ResourceItem.builder()
                .title("Test Resource")
                .description("Recurso de prueba")
                .url("https://example.com")
                .ownerId(savedUser.getId())
                .tags(List.of("demo", "java"))
                .build();

        mockMvc.perform(post("/api/resources")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resource)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Test Resource"));
    }
}
