package com.resourcevault.application.port.in;

import com.resourcevault.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserUseCase {
    User createUser(User user);
    Optional<User> getUserById(Long id);
    List<User> getUsers();
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
