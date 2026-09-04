package com.studyquest.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // İstemcilerin dinleyeceği (abone olacağı) prefix: /topic/room/{roomCode}
        config.enableSimpleBroker("/topic");
        
        // İstemcilerin sunucuya mesaj fırlatacağı prefix: /app/...
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Mobil uygulamanın ws://... üzerinden bağlanacağı el sıkışma noktası
        registry.addEndpoint("/ws-study")
                .setAllowedOriginPatterns("*");
    }
}