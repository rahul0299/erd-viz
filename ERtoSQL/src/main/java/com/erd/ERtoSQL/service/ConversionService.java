package com.erd.ERtoSQL.service;

import com.erd.ERtoSQL.domain.Node;
import com.erd.ERtoSQL.util.ConversionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class ConversionService {


    HashMap<String, List<String>> linksMap;
    HashMap<String, Node> nodesMap;

    public String handleErToSQL(String erData) {
        JSONObject jsonObject = new JSONObject(erData);

        nodesMap = ConversionUtils.constructNodeMap(jsonObject.getJSONArray("nodeDataArray"));

        linksMap = ConversionUtils.
                constructLinksMap(jsonObject.getJSONArray("linkDataArray"));

        return "Hi";
    }
}
