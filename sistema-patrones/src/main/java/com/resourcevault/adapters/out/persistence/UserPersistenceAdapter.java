package com.resourcevault.adapters.out.persistence;

import com.resourcevault.application.port.out.UserPersistencePort;
import com.resourcevault.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserPersistencePort {

    private final UserRepository userRepository;

    @Override
    public User save(User user) {
        UserEntity entity = userRepository.findById(user.getId()).orElseThrow();

        entity.setUsername(user.getUsername());
        entity.setEmail(user.getEmail());
        entity.setRole(user.getRole());

        UserEntity saved = userRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    private User mapToDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .role(entity.getRole())
                .build();
    }

    private UserEntity mapToEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole() == null ? User.Role.USER : user.getRole())
                .build();
    }
}
