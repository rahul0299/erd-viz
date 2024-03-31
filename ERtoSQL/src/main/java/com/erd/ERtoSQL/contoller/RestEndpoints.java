package com.erd.ERtoSQL.contoller;

import com.erd.ERtoSQL.service.ConversionService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestEndpoints {

    Gson gson = new Gson();

    @Autowired
    ConversionService conversionService;


    @PostMapping("/toSQL")
    public String toSQL(@RequestBody String erData) {
        return conversionService.handleErToSQL(erData);
    }
}
