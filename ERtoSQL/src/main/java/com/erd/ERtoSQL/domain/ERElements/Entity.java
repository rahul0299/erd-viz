package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;


@Data
public class Entity extends Node {


    Boolean isWeak = false;
    // Lets you know that it has to merge with something
    String mergeWith;


    public Entity(String name, String primaryKey, List<Object> attributes) {
        super(name, primaryKey, attributes);

    }

    public Entity() {
        super();
    }
}
