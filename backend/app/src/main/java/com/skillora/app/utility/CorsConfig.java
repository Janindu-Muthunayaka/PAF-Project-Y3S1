package com.skillora.app.utility;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials to be sent, so replace '*' with the exact origin
        config.addAllowedOrigin("http://localhost:3000"); 
        config.addAllowedOrigin("http://localhost:3001"); 
        config.addAllowedOrigin("http://localhost:3002"); 
        config.addAllowedHeader("*");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        // Allow credentials to be sent in the request
        config.setAllowCredentials(true);  // Enable credentials (cookies)
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
