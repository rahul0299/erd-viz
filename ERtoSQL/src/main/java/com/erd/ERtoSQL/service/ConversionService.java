package com.erd.ERtoSQL.service;

import com.erd.ERtoSQL.domain.ERElements.*;
import com.erd.ERtoSQL.util.ConversionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class ConversionService {


    HashMap<String, List<String>> linksMap;
    HashMap<String, Node> nodesMap;

    HashMap<String, Attribute> attributesMap;


    public String handleErToSQL(String erData) {
        JSONObject jsonObject = new JSONObject(erData);

        constructNodeMap(jsonObject.getJSONArray("nodeDataArray"));

//        linksMap = constructLinksMap(jsonObject.getJSONArray("linkDataArray"));

        addAttributes();

        return nodesMap.toString();
    }

    //Construct map of the keys of the elements and their direct links
    public HashMap<String, List<String>> constructLinksMap(JSONArray linksArray) {
        HashMap<String, List<String>> linksMap = new HashMap<>();
        for (int i = 0; i < linksArray.length(); i++) {
            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("from"),
                    k -> new ArrayList<>()).add(linksArray.getJSONObject(i).getString("to"));
            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("to"),
                    k -> new ArrayList<>()).add(linksArray.getJSONObject(i).getString("from"));
        }
        return linksMap;
    }

    public void constructNodeMap(JSONArray nodes) {
        nodesMap = new HashMap<>();
        attributesMap = new HashMap<>();
        for (int i = 0; i < nodes.length(); i++) {
            if ("entity".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {
                nodesMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Entity(nodes.getJSONObject(i).get("key").toString(),
                        nodes.getJSONObject(i).get("primaryKey").toString(),nodes.getJSONObject(i).getJSONArray("attributes").toList()));
            } else if ("relation".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {
                nodesMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Relation(nodes.getJSONObject(i).get("key").toString()));
            } else if ("attribute".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {
                attributesMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Attribute(nodes.getJSONObject(i).get("key").toString()));
            }

        }

    }

    public void addAttributes() {
        for (String element : nodesMap.keySet()) {

            for (String connectedElement : linksMap.get(element)) {
                if (nodesMap.get(connectedElement) instanceof Attribute) {
                    (nodesMap.get(element)).addToAttributes((Attribute) nodesMap.get(connectedElement));
                }
            }


        }
    }

    public void removeAttributesFromMap() {
        for (String i : nodesMap.keySet()) {
            if (nodesMap.get(i) instanceof Attribute) {
                linksMap.remove(i);
            }
        }
    }
}
