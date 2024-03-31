package com.erd.ERtoSQL.domain.ERElements;

import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;


@Data
public class Entity  extends Node {


    Boolean isWeak;

    public Entity(String name, String primaryKey, List<Object> attributes) {
        super(name,primaryKey,attributes);

    }

    public Entity(){
        super();
    }
}
