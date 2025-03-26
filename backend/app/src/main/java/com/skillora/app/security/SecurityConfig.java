package com.skillora.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @SuppressWarnings("removal")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF protection if needed
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()  // Allow register and login publicly
                .anyRequest().permitAll()  // Allow all other requests without authentication
            )
            .formLogin(form -> form
                .disable()  // Disable form login (for API-only authentication)
            )
            .logout(logout -> logout
                .permitAll()  // Allow everyone to log out
            );

        // CORS configuration
        http.cors().configurationSource(corsConfigurationSource());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins (e.g., your React front-end URL)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));  // Replace this with the React front-end URL

        // Allow common methods and preflight OPTIONS request
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));  // Include OPTIONS for preflight

        // Set allowed headers, including Content-Type and Authorization headers
        configuration.setAllowedHeaders(List.of("Content-Type", "Authorization"));

        // Allow credentials, such as cookies or authentication headers
        configuration.setAllowCredentials(true); 
        
        // Add the CORS configuration to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
