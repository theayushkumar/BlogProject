package com.example.blog.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminAccountInitializer implements ApplicationRunner {
    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminAccountInitializer(
            UserAccountRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:}") String username,
            @Value("${app.admin.password:}") String password) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (username.isBlank() || password.isBlank()) {
            throw new IllegalStateException(
                    "Set ADMIN_USERNAME and ADMIN_PASSWORD to initialize the administrator account");
        }
        if (username.length() > 100) {
            throw new IllegalStateException("ADMIN_USERNAME must be at most 100 characters");
        }
        if (password.length() < 12) {
            throw new IllegalStateException("ADMIN_PASSWORD must be at least 12 characters");
        }

        users.findByUsername(username).ifPresentOrElse(
                existing -> {
                    if (existing.getRole() != UserRole.ADMIN) {
                        throw new IllegalStateException(
                                "ADMIN_USERNAME already belongs to an account without the ADMIN role");
                    }
                },
                () -> users.save(new UserAccount(
                        username, passwordEncoder.encode(password), UserRole.ADMIN)));
    }
}
