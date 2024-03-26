package com.erd.ERtoSQL;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestEndpoints {

    @GetMapping("/toSQL")
    public void toSQL(String erData){
    }
}
