package com.erd.ERtoSQL.contoller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestEndpoints {

    @PostMapping("/toSQL")
    public String toSQL(String erData){
        return "Hi";
    }
}
