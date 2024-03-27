package com.erd.ERtoSQL.domain;

import lombok.Data;

import java.util.List;

@Data
public class Relation implements Node {

    String name;
    List<Attribute> attributes;

    public Relation(String name) {
        this.name = name;
    }

}
