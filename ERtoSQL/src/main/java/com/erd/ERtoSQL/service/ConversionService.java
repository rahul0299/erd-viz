package com.erd.ERtoSQL.service;

import com.erd.ERtoSQL.domain.ERElements.*;
import com.erd.ERtoSQL.domain.SQLElements.Table;
import org.apache.commons.lang3.tuple.MutablePair;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class ConversionService {


    HashMap<String, List<MutablePair<String, Link>>> linksMap;
    HashMap<String, Entity> entityMap;
    HashMap<String, Relation> relationMap;

    HashMap<String, Attribute> attributesMap;

    HashMap<String, HashMap<String,List<String>>> relationTables = new HashMap<>();


    public String handleErToSQL(String erData) {
        JSONObject jsonObject = new JSONObject(erData);

        constructNodeMap(jsonObject.getJSONArray("nodeDataArray"));

        constructLinksMap(jsonObject.getJSONArray("linkDataArray"));

        findInfoForTable();

//        addAttributes();

        return entityMap.toString();
    }

    //Construct map of the keys of the elements and their direct links
    public void constructLinksMap(JSONArray linksArray) {
        linksMap = new HashMap<>();
        for (int i = 0; i < linksArray.length(); i++) {

            if (attributesMap.get(linksArray.getJSONObject(i).get("from").toString()) != null ||
                    attributesMap.get(linksArray.getJSONObject(i).get("to").toString()) != null) {
                continue;
            }

            Link link = new Link(linksArray.getJSONObject(i).get("text").toString().substring(1, 2),
                    linksArray.getJSONObject(i).get("text").toString().substring(3, 4),
                    linksArray.getJSONObject(i).get("from").toString(), linksArray.getJSONObject(i).get("to").toString());

            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("from"),
                    k -> new ArrayList<>()).add(new MutablePair<>(linksArray.getJSONObject(i).getString("to"), link));

            linksMap.computeIfAbsent(linksArray.getJSONObject(i).getString("to"),
                    k -> new ArrayList<>()).add(new MutablePair<>(linksArray.getJSONObject(i).getString("from"), link));
        }
    }

    public void constructNodeMap(JSONArray nodes) {
        entityMap = new HashMap<>();
        relationMap = new HashMap<>();
        attributesMap = new HashMap<>();
        for (int i = 0; i < nodes.length(); i++) {
            if ("entity".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {

                entityMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Entity(nodes.getJSONObject(i).get("name").toString(),
                                nodes.getJSONObject(i).has("primaryKey") ? nodes.getJSONObject(i).get("primaryKey").toString() : null,
                                nodes.getJSONObject(i).getJSONArray("attributes").toList()));

            } else if ("relation".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {

                relationMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Relation(nodes.getJSONObject(i).get("name").toString(),
                                nodes.getJSONObject(i).has("primaryKey") ? nodes.getJSONObject(i).get("primaryKey").toString() : null,
                                nodes.getJSONObject(i).getJSONArray("attributes").toList()));

            } else if ("attribute".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {

                attributesMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Attribute(nodes.getJSONObject(i).get("name").toString(),
                                nodes.getJSONObject(i).get("type").toString(),
                                Boolean.parseBoolean(nodes.getJSONObject(i).get("isNullable").toString()),
                                Boolean.parseBoolean(nodes.getJSONObject(i).get("isUnique").toString()),
                                Boolean.parseBoolean(nodes.getJSONObject(i).get("isPrimary").toString())));
            }

        }

    }

    private void findInfoForTable() {
        for (String relation : relationMap.keySet()) {

            if (linksMap.get(relation) == null) {
                continue;
            }


            List<MutablePair<String, String>> foreignKeys = new ArrayList<>();
            List<String> primaryKeys = new ArrayList<>();
            List<String> attributes = new ArrayList<>(relationMap.get(relation).getAttributes());
            for (MutablePair<String, Link> pair : linksMap.get(relation)) {
                if (pair.getRight().getLowerBound().equalsIgnoreCase("1") &&
                        pair.getRight().getUpperBound().equalsIgnoreCase("1")) {
                    //Merge
                    entityMap.get(pair.getLeft()).setMergeWith(relation);
                    attributes.addAll(entityMap.get(pair.getLeft()).getAttributes());

                } else if (entityMap.get(pair.getLeft()) != null && entityMap.get(pair.getLeft()).getIsWeak()) {
                    //Merge
                    entityMap.get(pair.getLeft()).setMergeWith(relation);
                    attributes.addAll(entityMap.get(pair.getLeft()).getAttributes());
                } else {
                    if (pair.getRight().getLowerBound().equalsIgnoreCase("0") &&
                            pair.getRight().getUpperBound().equalsIgnoreCase("1")) {
                        //Special case
                    } else {
                        //Normal case
                        if (entityMap.get(pair.getLeft()).getPrimaryKey() != null) {
                            primaryKeys.add(entityMap.get(pair.getLeft()).getPrimaryKey());
                            foreignKeys.add(new MutablePair<>(entityMap.get(pair.getLeft()).getPrimaryKey(),
                                    pair.getLeft()));
                        }
                    }
                }

            }

            relationTables.put(relationMap.get(relation).getName(), new Table(relation, attributes, primaryKeys, foreignKeys));
        }
    }


}
