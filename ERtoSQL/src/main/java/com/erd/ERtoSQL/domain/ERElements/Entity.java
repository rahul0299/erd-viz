package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;


@Data
public class Entity extends Structure implements Node {

    String name;
    List<Relation> relations;
    Boolean isWeak;

    public Entity(String name) {
        this.name = name;
    }
}
