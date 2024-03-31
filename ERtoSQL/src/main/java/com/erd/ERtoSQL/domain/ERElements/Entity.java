package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;


@Data
public class Entity extends Node {


    Boolean isWeak = false;
    String mergeWith;

    public Entity(String name, String primaryKey, List<Object> attributes) {
        super(name, primaryKey, attributes);

    }

    public Entity() {
        super();
    }
}
