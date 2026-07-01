package com.resourcevault.application.service;

import com.resourcevault.application.port.in.UserUseCase;
import com.resourcevault.application.port.out.UserPersistencePort;
import com.resourcevault.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService implements UserUseCase {

    private final UserPersistencePort userPersistencePort;

    @Override
    public User createUser(User user) {
        return userPersistencePort.save(user);
    }

    @Override
    public java.util.Optional<User> getUserById(Long id) {
        return userPersistencePort.findById(id);
    }

    @Override
    public List<User> getUsers() {
        return userPersistencePort.findAll();
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userPersistencePort.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + id));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        return userPersistencePort.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        userPersistencePort.deleteById(id);
    }
}
