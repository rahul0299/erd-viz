package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;
import org.json.JSONArray;

import java.util.List;


@Data
public class Entity  extends Node {


    List<Relation> relations;
    Boolean isWeak;

    public Entity(String name, String primaryKey, JSONArray attributes) {
        this.name = name;
    }
}
