package com.erd.ERtoSQL.util;

import com.erd.ERtoSQL.domain.ERElements.*;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ConversionUtils {


    //Construct map of the keys of the elements and their direct links
    public static HashMap<String, List<String>> constructLinksMap(JSONArray linksArray) {
        HashMap<String, List<String>> linksMap = new HashMap<>();
        for (int i = 0; i < linksArray.length(); i++) {
            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("from"),
                    k -> new ArrayList<>()).add(linksArray.getJSONObject(i).getString("to"));
        }
        return linksMap;
    }

    public static HashMap<String, Node> constructNodeMap(JSONArray nodes) {
        HashMap<String, Node> nodesMap = new HashMap<>();
        for (int i = 0; i < nodes.length(); i++) {
            if ("Rectangle".equalsIgnoreCase(nodes.getJSONObject(i).get("figure").toString())) {
                nodesMap.put(nodes.getJSONObject(i).get("key").toString(), new Entity(nodes.getJSONObject(i).get("key").toString()));
            } else if ("Diamond".equalsIgnoreCase(nodes.getJSONObject(i).get("figure").toString())) {
                nodesMap.put(nodes.getJSONObject(i).get("key").toString(), new Relation(nodes.getJSONObject(i).get("key").toString()));
            } else if ("Circle".equalsIgnoreCase(nodes.getJSONObject(i).get("figure").toString())) {
                nodesMap.put(nodes.getJSONObject(i).get("key").toString(), new Attribute(nodes.getJSONObject(i).get("key").toString()));
            }

        }
        return nodesMap;
    }

    public static void addAttributes(HashMap<String, List<String>> linksMap, HashMap<String, Node> nodeHashMap) {
        for (String element : linksMap.keySet()) {

            if (nodeHashMap.get(element) instanceof Structure) {

                for (String connectedElement : linksMap.get(element)) {
                    if (nodeHashMap.get(connectedElement) instanceof Attribute) {
                        ((Structure) nodeHashMap.get(element)).addToAttributes((Attribute) nodeHashMap.get(connectedElement));
                    }
                }
            }

        }
    }


}
