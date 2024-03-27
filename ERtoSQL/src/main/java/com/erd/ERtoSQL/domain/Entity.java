package com.erd.ERtoSQL.domain;

import lombok.Data;

import java.util.List;


@Data
public class Entity implements Node {

    String name;
    List<Attribute> attributes;
    List<Relation> relations;
    Boolean isWeak;

    public Entity(String name) {
        this.name = name;
    }
}
