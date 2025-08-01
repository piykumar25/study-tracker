package com.piyush.authorizationservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/edu")
public class DummyController {

    @GetMapping
    public String getEdu() {
        return "This is Education Service";
    }

}
