package com.erd.ERtoSQL.contoller;

import com.erd.ERtoSQL.service.ConversionService;
import com.google.gson.*;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RestEndpoints {

    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    @Autowired
    ConversionService conversionService;


    @PostMapping("/toSQL")
    public @ResponseBody String toSQL(@RequestBody String erData, HttpServletResponse response) {
        JsonElement result = gson.toJsonTree(conversionService.handleErToSQL(erData));
        JsonObject jsonObject = new JsonObject();
        jsonObject.add("sql",result);
        response.addHeader("Access-Control-Allow-Origin","*");
        return gson.toJson(jsonObject);
    }
}
