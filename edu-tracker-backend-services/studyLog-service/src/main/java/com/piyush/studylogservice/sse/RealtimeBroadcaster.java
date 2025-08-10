package com.piyush.studylogservice.sse;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RealtimeBroadcaster {
    private final Set<SseEmitter> clients = ConcurrentHashMap.newKeySet();

    public SseEmitter connect() {
        // 0 = no server-side timeout; client may reconnect automatically
        SseEmitter emitter = new SseEmitter(0L);
        clients.add(emitter);
        emitter.onCompletion(() -> clients.remove(emitter));
        emitter.onTimeout(() -> clients.remove(emitter));
        emitter.onError((ex) -> clients.remove(emitter));
        // initial ping (optional)
        try { emitter.send(SseEmitter.event().name("ping").data("{}")); } catch (IOException ignored) {}
        return emitter;
    }

    public void created(Object payload) { broadcast("created", payload); }
    public void updated(Object payload) { broadcast("updated", payload); }
    public void deleted(Object payload) { broadcast("deleted", payload); }

    private void broadcast(String event, Object payload) {
        List<SseEmitter> dead = new java.util.ArrayList<>();
        for (SseEmitter client : clients) {
            try {
                client.send(SseEmitter.event().name(event).data(payload));
            } catch (Exception e) {
                dead.add(client);
            }
        }
        clients.removeAll(dead);
    }

    // Heartbeat every 25s so proxies keep the stream alive
    @Scheduled(fixedRate = 25000)
    public void heartbeat() {
        broadcast("ping", "{}");
    }
}