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



    public String handleErToSQL(String erData) {
        JSONObject jsonObject = new JSONObject(erData);

        nodesMap = constructNodeMap(jsonObject.getJSONArray("nodeDataArray"));

        linksMap = constructLinksMap(jsonObject.getJSONArray("linkDataArray"));

        addAttributes();

        return nodesMap.toString();
    }

    //Construct map of the keys of the elements and their direct links
    public  HashMap<String, List<String>> constructLinksMap(JSONArray linksArray) {
        HashMap<String, List<String>> linksMap = new HashMap<>();
        for (int i = 0; i < linksArray.length(); i++) {
            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("from"),
                    k -> new ArrayList<>()).add(linksArray.getJSONObject(i).getString("to"));
            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("to"),
                    k -> new ArrayList<>()).add(linksArray.getJSONObject(i).getString("from"));
        }
        return linksMap;
    }

    public  HashMap<String, Node> constructNodeMap(JSONArray nodes) {
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

    public  void addAttributes() {
        for (String element : linksMap.keySet()) {

            if (nodesMap.get(element) instanceof Structure) {

                for (String connectedElement : linksMap.get(element)) {
                    if (nodesMap.get(connectedElement) instanceof Attribute) {
                        ((Structure) nodesMap.get(element)).addToAttributes((Attribute) nodesMap.get(connectedElement));
                    }
                }
            }

        }
    }

    public void removeAttributesFromMap(){
        for(String i : nodesMap.keySet()){
            if(nodesMap.get(i) instanceof Attribute){
                linksMap.remove(i);
            }
        }
    }
}
