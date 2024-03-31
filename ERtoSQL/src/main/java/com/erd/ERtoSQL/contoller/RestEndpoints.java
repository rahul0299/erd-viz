package com.erd.ERtoSQL.contoller;

import com.erd.ERtoSQL.service.ConversionService;
import com.erd.ERtoSQL.util.ConversionUtils;
import com.google.gson.Gson;


import com.google.gson.JsonArray;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class RestEndpoints {

    Gson gson = new Gson();

    @Autowired
    ConversionService conversionService;


    @GetMapping("/toSQL")
    public String toSQL(String erData) {
        return conversionService.handleErToSQL("{\n" +
                "  \"nodeDataArray\": [\n" +
                "    {\n" +
                "      \"key\": \"583f\",\n" +
                "      \"name\": \"Person\",\n" +
                "      \"color\": \"white\",\n" +
                "      \"loc\": \"-435.01666259765625 -177.5\",\n" +
                "      \"category\": \"entity\",\n" +
                "      \"primaryKey\": \"55f6\",\n" +
                "      \"attributes\": [\n" +
                "        \"55f6\",\n" +
                "        \"2234\"\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"key\": \"0293\",\n" +
                "      \"name\": \"WorksFor\",\n" +
                "      \"color\": \"white\",\n" +
                "      \"loc\": \"-69.01666259765625 -196.5\",\n" +
                "      \"category\": \"relation\",\n" +
                "      \"attributes\": [\n" +
                "        \"e04d\",\n" +
                "        \"8b18\"\n" +
                "      ],\n" +
                "      \"primaryKey\": \"e04d\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"key\": \"55f6\",\n" +
                "      \"category\": \"attribute\",\n" +
                "      \"loc\": \"-449.8309873353578 -31.786722505910433\",\n" +
                "      \"fill\": \"lightblue\",\n" +
                "      \"isPrimary\": false,\n" +
                "      \"isUnique\": true,\n" +
                "      \"isNullable\": false,\n" +
                "      \"type\": \"varchar\",\n" +
                "      \"name\": \"id\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"key\": \"2234\",\n" +
                "      \"category\": \"attribute\",\n" +
                "      \"loc\": \"-454.6968967478971 -68.19835416957835\",\n" +
                "      \"fill\": \"transparent\",\n" +
                "      \"isPrimary\": false,\n" +
                "      \"isUnique\": false,\n" +
                "      \"isNullable\": true,\n" +
                "      \"type\": \"varchar\",\n" +
                "      \"name\": \"address\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"key\": \"e04d\",\n" +
                "      \"category\": \"attribute\",\n" +
                "      \"loc\": \"-126.3634204519862 75.18623029735514\",\n" +
                "      \"fill\": \"lightblue\",\n" +
                "      \"isPrimary\": false,\n" +
                "      \"isUnique\": true,\n" +
                "      \"isNullable\": false,\n" +
                "      \"type\": \"varchar\",\n" +
                "      \"name\": \"contract\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"key\": \"8b18\",\n" +
                "      \"category\": \"attribute\",\n" +
                "      \"loc\": \"-115.29836974274151 93.57743774925575\",\n" +
                "      \"fill\": \"transparent\",\n" +
                "      \"isPrimary\": false,\n" +
                "      \"isUnique\": false,\n" +
                "      \"isNullable\": true,\n" +
                "      \"type\": \"varchar\",\n" +
                "      \"name\": \"att\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"linkDataArray\": [\n" +
                "    {\n" +
                "      \"from\": \"583f\",\n" +
                "      \"to\": \"55f6\",\n" +
                "      \"key\": \"7316\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"from\": \"583f\",\n" +
                "      \"to\": \"2234\",\n" +
                "      \"key\": \"f7cd\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"from\": \"0293\",\n" +
                "      \"to\": \"e04d\",\n" +
                "      \"key\": \"6d5d\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"from\": \"0293\",\n" +
                "      \"to\": \"8b18\",\n" +
                "      \"key\": \"f6e7\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"selectedData\": null,\n" +
                "  \"skipsDiagramUpdate\": false\n" +
                "}");
    }
}
