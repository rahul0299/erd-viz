package com.erd.ERtoSQL.service;

import com.erd.ERtoSQL.domain.ERElements.*;
import com.erd.ERtoSQL.domain.SQLElements.Table;
import org.apache.commons.lang3.tuple.MutablePair;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversionService {


    HashMap<String, List<MutablePair<String, Link>>> linksMap;
    HashMap<String, Entity> entityMap;
    HashMap<String, Relation> relationMap;

    HashMap<String, Attribute> attributesMap;

    HashMap<String, HashMap<String, List<String>>> relationInfo = new HashMap<>();

    HashMap<String, Table> tablesCreated = new HashMap<>();

    List<String> sqlStatements = new ArrayList<>();

    Set<String> sqlSet = new LinkedHashSet<>();

    private final String mergeWith = "MergeWith";
    private final String mergeWithWeak = "MergeWithWeak";
    private final String primaryKeyException = "PrimaryKeyException";
    private final String attachedToEntities = "AttachedToEntities";

    private final String notSpecialCase = "NotSpecialCase";
    private final String notMerging = "notMerging";


    public Set<String> handleErToSQL(String erData) {
        JSONObject jsonObject = new JSONObject(erData);

        constructNodeMap(jsonObject.getJSONArray("nodeDataArray"));

        constructLinksMap(jsonObject.getJSONArray("linkDataArray"));

        findInfoForRelations();

        iterateOverNodesToCreateTables();

        generateSQL();

        reorderSql();

        return sqlSet;
    }

    //Construct map of the keys of the elements and their direct links
    public void constructLinksMap(JSONArray linksArray) {
        linksMap = new HashMap<>();
        for (int i = 0; i < linksArray.length(); i++) {

            if (linksArray.getJSONObject(i).has("path") ||
                    attributesMap.get(linksArray.getJSONObject(i).get("from").toString()) != null ||
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
        relationInfo = new HashMap<>();
        tablesCreated=new HashMap<>();
        sqlStatements=new ArrayList<>();
        sqlSet = new LinkedHashSet<>();
        for (int i = 0; i < nodes.length(); i++) {
            if ("entity".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {

                entityMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Entity(nodes.getJSONObject(i).get("name").toString(),
                                nodes.getJSONObject(i).has("primaryKey") ? nodes.getJSONObject(i).getJSONArray("primaryKey").toList() : null,
                                nodes.getJSONObject(i).getJSONArray("attributes").toList()));

            } else if ("relation".equalsIgnoreCase(nodes.getJSONObject(i).get("category").toString())) {

                relationMap.put(nodes.getJSONObject(i).get("key").toString(),
                        new Relation(nodes.getJSONObject(i).get("name").toString(),
                                nodes.getJSONObject(i).has("primaryKey") ? nodes.getJSONObject(i).getJSONArray("primaryKey").toList() : null,
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

    private void findInfoForRelations() {
        for (String relation : relationMap.keySet()) {

            if (linksMap.get(relation) == null) {
                continue;
            }

            relationInfo.put(relation, new HashMap<>());
            relationInfo.get(relation).put(mergeWith, new ArrayList<>());
            relationInfo.get(relation).put(mergeWithWeak, new ArrayList<>());
            relationInfo.get(relation).put(primaryKeyException, new ArrayList<>());
            relationInfo.get(relation).put(attachedToEntities, new ArrayList<>());
            relationInfo.get(relation).put(notSpecialCase, new ArrayList<>());
            relationInfo.get(relation).put(notMerging, new ArrayList<>());


            for (MutablePair<String, Link> pair : linksMap.get(relation)) {

                relationInfo.get(relation).get(attachedToEntities).add(pair.getLeft());

                if (entityMap.get(pair.getLeft()) != null && entityMap.get(pair.getLeft()).getIsWeak()) {
                    //Merge
                    entityMap.get(pair.getLeft()).setMergeWith(relation);
                    relationInfo.get(relation).get(mergeWithWeak).add(pair.getLeft());

                } else if (pair.getRight().getLowerBound().equalsIgnoreCase("1") &&
                        pair.getRight().getUpperBound().equalsIgnoreCase("1")) {
                    //Merge
                    entityMap.get(pair.getLeft()).setMergeWith(relation);
                    relationInfo.get(relation).get(mergeWith).add(pair.getLeft());
                } else if (pair.getRight().getLowerBound().equalsIgnoreCase("0") &&
                        pair.getRight().getUpperBound().equalsIgnoreCase("1")) {
                    //Special case
                    relationInfo.get(relation).get(primaryKeyException).add(pair.getLeft());
                } else {
                    relationInfo.get(relation).get(notSpecialCase).add(pair.getLeft());

                }
            }
        }

    }

    private void iterateOverNodesToCreateTables() {
        for (String entityKey : entityMap.keySet()) {
            if (entityMap.get(entityKey).getMergeWith() != null) {
                continue;
            }

            Entity currentEntity = entityMap.get(entityKey);
            //create table
            tablesCreated.put(entityKey, new Table(currentEntity.getName(), currentEntity.getAttributes()
                    , currentEntity.getPrimaryKey(), null));

            currentEntity.setTableCreated(entityKey);
        }

        //Handles merge cases
        for (String relationKey : relationMap.keySet()) {
            if (relationInfo.get(relationKey).get(mergeWith).isEmpty() &&
                    relationInfo.get(relationKey).get(mergeWithWeak).isEmpty()) {
                continue;
            }

            if (!relationInfo.get(relationKey).get(mergeWith).isEmpty()) {
                Relation currentRelation = relationMap.get(relationKey);
                String name = currentRelation.getName();
                List<String> attributes = new ArrayList<>(currentRelation.getAttributes());
                List<String> primaryKey = new ArrayList<>();
                //Add key of table not in merge relation but in attached
                List<MutablePair<List<String>, String>> foreignKeys = new ArrayList<>();

                for (String entityKey : relationInfo.get(relationKey).get(notSpecialCase)) {
                    foreignKeys.add(new MutablePair<>(entityMap.get(entityKey).getPrimaryKey(), entityKey));
                    attributes.addAll(entityMap.get(entityKey).getPrimaryKey());
                }

                //R table ready
                String finalMergeWith = null;
                for (String entityKey : relationInfo.get(relationKey).get(mergeWith)) {
                    if (entityMap.get(entityKey).getTableCreated() != null) {
                        //Merge with table with reference entityKey in tablesCreated
                        //Ignore
                        finalMergeWith = entityMap.get(entityKey).getTableCreated();
                    } else {
                        //Merge with entity directly and keep merging with other entities and put it finally in tablesCreated
                        Entity currentEntity = entityMap.get(entityKey);
                        name = currentEntity.getName() + "_" + name;
                        attributes.addAll(currentEntity.getAttributes());
                        primaryKey.addAll(currentEntity.getPrimaryKey());

                    }
                }
                if (finalMergeWith == null) {
                    tablesCreated.put(relationInfo.get(relationKey).get(mergeWith).get(0), new Table(name, attributes, primaryKey, foreignKeys));
                    relationInfo.get(relationKey).get(mergeWith).forEach(t -> entityMap.get(t).setTableCreated(relationInfo.get(relationKey).get(mergeWith).get(0)));
                    currentRelation.setTableCreated(relationInfo.get(relationKey).get(mergeWith).get(0));
                } else {
                    //Add it to finalMergeWith
                    Table currentTable = tablesCreated.get(finalMergeWith);
                    currentTable.setName(currentTable.getName() + name);
                    currentTable.getAttributes().addAll(attributes);
                    currentTable.getPrimaryKey().addAll(primaryKey);
                    currentTable.getForeignKeys().addAll(foreignKeys);
                    for(String i: relationInfo.get(relationKey).get(mergeWith)){
                        entityMap.get(i).setTableCreated(finalMergeWith);
                    }
                    currentRelation.setTableCreated(finalMergeWith);
                }
            }

        }


        //Handles primary key exception case
        for (String relationKey : relationMap.keySet()){
            if(relationInfo.get(relationKey).get(primaryKeyException).isEmpty()){
                continue;
            }

            Relation currentRelation = relationMap.get(relationKey);

            if(currentRelation.getTableCreated()!=null){
                //Means relationship is merged with some other entities as well
                //Have to just add the
                Table currentTable = tablesCreated.get(currentRelation.getTableCreated());
                for(String i: relationInfo.get(relationKey).get(primaryKeyException)){
                    Entity entity = entityMap.get(i);
                    entity.getPrimaryKey().forEach(t -> attributesMap.get(t).setIsUnique(true));
                    currentTable.getPrimaryKey().addAll(entity.getPrimaryKey());
                    currentTable.getAttributes().addAll(entity.getPrimaryKey());
                    currentTable.getForeignKeys().add(new MutablePair<>(entity.getPrimaryKey(), i));
                }


            }
            else{
                String name = currentRelation.getName();
                List<String> attributes = new ArrayList<>(currentRelation.getAttributes());
                List<String> primaryKey = new ArrayList<>();
                List<MutablePair<List<String>, String>> foreignKeys = new ArrayList<>();
                for(String attachedEntitiesReference : relationInfo.get(relationKey).get(attachedToEntities)){
                    if(relationInfo.get(relationKey).get(primaryKeyException).contains(attachedEntitiesReference)){
                        entityMap.get(attachedEntitiesReference).getPrimaryKey().forEach(t -> attributesMap.get(t).setIsUnique(true));
                        attributes.addAll(entityMap.get(attachedEntitiesReference).getPrimaryKey());
                    }
                    else{
                        attributes.addAll(entityMap.get(attachedEntitiesReference).getPrimaryKey());
                    }
                    primaryKey.addAll(entityMap.get(attachedEntitiesReference).getPrimaryKey());
                    foreignKeys.add(new MutablePair<>(entityMap.get(attachedEntitiesReference).getPrimaryKey(), attachedEntitiesReference));
                }

                tablesCreated.put(relationKey,new Table(currentRelation.getName(),attributes,primaryKey,foreignKeys));
                currentRelation.setTableCreated(relationKey);
            }
        }



        //Normal case of relations
        for (String relationKey : relationMap.keySet()) {
            if (relationMap.get(relationKey).getTableCreated()!=null) {
                continue;
            }

            Relation currentRelation = relationMap.get(relationKey);


            List<String> attributes = new ArrayList<>(currentRelation.getAttributes());
            List<String> primaryKeys = new ArrayList<>();
            List<MutablePair<List<String>, String>> foreignKeys = new ArrayList<>();

            for (String entityKey : relationInfo.get(relationKey).get(attachedToEntities)) {
                foreignKeys.add(new MutablePair<>(entityMap.get(entityKey).getPrimaryKey(), entityKey));
                primaryKeys.addAll(entityMap.get(entityKey).getPrimaryKey());
                attributes.addAll(entityMap.get(entityKey).getPrimaryKey());
            }
            tablesCreated.put(relationKey, new Table(currentRelation.getName(), attributes
                    , primaryKeys, foreignKeys));

        }
    }

    private void generateSQL() {
        for (String tableReference : tablesCreated.keySet()) {
            String sql = "CREATE TABLE " + tablesCreated.get(tableReference).getName() + " (";

            //Adding attributes
            for (String attributeReference : tablesCreated.get(tableReference).getAttributes()) {

                Attribute currentAttribute = attributesMap.get(attributeReference);
                sql += "\n" + currentAttribute.getName() + " " + currentAttribute.getDataType();

                if (currentAttribute.getIsUnique()) {
                    sql += " UNIQUE ";
                }

                if (!currentAttribute.getIsNullable()){
                    sql += " NOT NULL";
                }
                sql+=",";

            }

            if(tablesCreated.get(tableReference).getPrimaryKey()!=null && !tablesCreated.get(tableReference).getPrimaryKey().isEmpty()){
                sql+="\nPRIMARY KEY (";
                for (String primaryKeyReference : tablesCreated.get(tableReference).getPrimaryKey()){
                    sql+= " "+attributesMap.get(primaryKeyReference).getName()+",";
                }
                sql = sql.substring(0,sql.length()-1);
                sql+=" ),";

            }

            if(tablesCreated.get(tableReference).getForeignKeys()!=null && !tablesCreated.get(tableReference).getForeignKeys().isEmpty()){
                String foreignAttributes,foreign;
                for(MutablePair<List<String>, String> foreignKeyReference :
                        tablesCreated.get(tableReference).getForeignKeys()){
                    foreignAttributes="";foreign="";
                    for(String primaryKeyReference : foreignKeyReference.getLeft()){
                        foreignAttributes+=attributesMap.get(primaryKeyReference).getName()+" ,";
                    }
                    foreignAttributes = foreignAttributes.substring(0,foreignAttributes.length()-1);
                    foreign="\nFOREIGN KEY ( "+foreignAttributes+") REFERENCES "+
                            tablesCreated.get(entityMap.get(foreignKeyReference.getRight()).getTableCreated()).getName()
                            +" ("+foreignAttributes+"),";
                    sql+=foreign;
                }
                sql = sql.substring(0,sql.length()-1);
            }

            if(sql.charAt(sql.length()-1)==','){
                sql = sql.substring(0,sql.length()-1);
            }

            sql+= ");";
            sql = sql.replaceAll(" number"," integer");
            sqlStatements.add(sql);
        }
    }

    private void reorderSql(){
        for(String i : sqlStatements){
            if(!i.contains("FOREIGN KEY")){
                sqlSet.add(i);
            }
        }
        sqlSet.addAll(sqlStatements);
    }
}


