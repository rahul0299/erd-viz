package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;


@Data
public class Entity extends Node {


    Boolean isWeak = false;
    // Lets you know that it has to merge with something
    String mergeWith;
    // Lets you know if it has already been merged with some table created and the reference of that table
    String tableCreated;

    public Entity(String name, String primaryKey, List<Object> attributes) {
        super(name, primaryKey, attributes);

    }

    public Entity() {
        super();
    }
}
