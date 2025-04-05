package org.rustem.VueBackend.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.rustem.VueBackend.DTO.UserDTO;
import org.rustem.VueBackend.models.User;
import org.rustem.VueBackend.repositories.UserRepository;
import org.rustem.VueBackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO){
        try{
            userService.registerUser(userDTO);
            return ResponseEntity.ok("Пользователь успешно зарегистрирован");
        } catch (Exception e){
            return ResponseEntity.badRequest().body("Ошибка регистрации" + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(HttpServletRequest request, @RequestBody UserDTO userDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            return ResponseEntity.ok("Пользователь успешно вошел");

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Ошибка входа: Неверный email или пароль");
        }
    }

    @GetMapping("/id")
    public ResponseEntity<Long> getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();
        User userEntity = null;

        if (principal instanceof org.rustem.VueBackend.security.UserDetails) {
            // Приводим principal к нашему кастомному UserDetails
            org.rustem.VueBackend.security.UserDetails userDetails =
                    (org.rustem.VueBackend.security.UserDetails) principal;
            userEntity = userDetails.getUser();  // Допустим, у вас есть такой метод
        } else if (principal instanceof org.springframework.security.core.userdetails.User) {
            String email = ((org.springframework.security.core.userdetails.User) principal).getUsername();
            userEntity = userRepository.findByEmail(email).orElse(null);
        } else if (principal instanceof User) {
            userEntity = (User) principal;
        }

        if (userEntity != null) {
            return ResponseEntity.ok(Long.valueOf(userEntity.getId()));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
