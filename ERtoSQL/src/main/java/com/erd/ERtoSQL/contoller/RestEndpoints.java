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
        return conversionService.handleErToSQL("{ \"class\": \"GraphLinksModel\",\n" +
                "  \"nodeDataArray\": [\n" +
                "{\"text\":\"Entity A\",\"key\":\"e1\",\"loc\":\"-270 -140\",\"color\":\"black\",\"fill\":\"white\",\"figure\":\"Rectangle\",\"thickness\":3,\"size\":\"150 80\"},\n" +
                "{\"text\":\"Entity B\",\"key\":\"e2\",\"loc\":\"250 -140\",\"color\":\"black\",\"fill\":\"white\",\"figure\":\"Rectangle\",\"thickness\":3,\"size\":\"150 80\"},\n" +
                "{\"text\":\"Relationship AB\",\"key\":\"r1\",\"loc\":\"-20 -140\",\"color\":\"black\",\"fill\":\"white\",\"figure\":\"Diamond\",\"thickness\":3,\"size\":\"160 80\"},\n" +
                "{\"text\":\"A3\",\"key\":\"a2\",\"loc\":\"-220 70\",\"color\":\"black\",\"fill\":\"white\",\"figure\":\"Circle\",\"thickness\":3,\"size\":\"20 20\"},\n" +
                "{\"text\":\"A1\",\"key\":\"a4\",\"loc\":\"250 50\",\"color\":\"black\",\"fill\":\"black\",\"figure\":\"Circle\",\"thickness\":3,\"size\":\"20 20\"},\n" +
                "{\"text\":\"A1\",\"key\":\"a22\",\"loc\":\"-320 70\",\"color\":\"black\",\"fill\":\"white\",\"figure\":\"Circle\",\"thickness\":3,\"size\":\"40 40\"},\n" +
                "{\"text\":\"A2\",\"key\":\"a222\",\"loc\":\"-270 70\",\"color\":\"black\",\"fill\":\"white\",\"figure\":\"Circle\",\"thickness\":3,\"size\":\"40 40\"}\n" +
                "],\n" +
                "  \"linkDataArray\": [\n" +
                "{\"from\":\"e1\",\"to\":\"r1\",\"text\":\"(0,n)\",\"dir\":0,\"points\":[-195,-140,-185,-140,-147.5,-140,-147.5,-140,-110,-140,-100,-140]},\n" +
                "{\"from\":\"e2\",\"to\":\"r1\",\"text\":\"(0,n)\",\"dir\":0,\"points\":[175,-140,165,-140,117.5,-140,117.5,-140,70,-140,60,-140]},\n" +
                "{\"from\":\"e1\",\"to\":\"a2\",\"dir\":0,\"points\":[-232.5,-100,-232.5,-90,-232.5,-93.37109375,-220.1484375,-93.37109375,-220.1484375,-78.92578125,-220.009765625,-78.92578125,-220.009765625,40,-220,50]},\n" +
                "{\"from\":\"e2\",\"to\":\"a4\",\"dir\":0,\"points\":[250,-100,250,-90,250,-35,250,-35,250,20,250,30]},\n" +
                "{\"from\":\"e1\",\"to\":\"a22\",\"points\":[-320,0,-320,10,-320,25,-320,25,-320,40,-320,50],\"dir\":0},\n" +
                "{\"from\":\"e1\",\"to\":\"a222\",\"points\":[-270,0,-270,10,-270,25,-270,25,-270,40,-270,50],\"dir\":0}\n" +
                "]}");
    }
}
